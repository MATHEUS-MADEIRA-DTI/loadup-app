import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // MongoDB duplicate key error → 409 Conflict
    if (exception && typeof exception === 'object' && (exception as any).code === 11000) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Resource already exists',
        timestamp: new Date().toISOString(),
      });
    }

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;

    let message: string;
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (exceptionResponse && typeof exceptionResponse === 'object') {
      const r = exceptionResponse as Record<string, unknown>;
      message =
        typeof r['message'] === 'string'
          ? r['message']
          : JSON.stringify(r['message'] ?? exceptionResponse);
    } else {
      message = 'Internal server error';
    }
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error('Internal Server Error:', exception);
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
