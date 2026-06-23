import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Types } from 'mongoose';
import { convertToSaoPauloISOString } from '../utils/timezone.util';

function toPlain(payload: unknown): unknown {
  if (payload === null || payload === undefined) return payload;
  if (payload instanceof Date) return convertToSaoPauloISOString(payload);
  if (payload instanceof Types.ObjectId) return payload.toHexString();
  if (Array.isArray(payload)) return payload.map(toPlain);
  if (payload && typeof payload === 'object') {
    // Convert Mongoose documents to plain objects first
    const plain: unknown =
      typeof (payload as any).toObject === 'function'
        ? (payload as any).toObject({ virtuals: false })
        : payload;

    if (plain instanceof Date) return convertToSaoPauloISOString(plain);
    if (plain instanceof Types.ObjectId) return (plain as Types.ObjectId).toHexString();
    if (Array.isArray(plain)) return plain.map(toPlain);

    const result: Record<string, unknown> = {};
    for (const key of Object.keys(plain as object)) {
      result[key] = toPlain((plain as Record<string, unknown>)[key]);
    }
    return result;
  }
  return payload;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => toPlain(data)));
  }
}
