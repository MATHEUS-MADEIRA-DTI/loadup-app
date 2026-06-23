import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PlateauService } from '../plateau.service';
import { SessionCompletedEvent } from '../../training-session/training-session.service';

@Injectable()
export class SessionCompletedListener {
  private readonly logger = new Logger(SessionCompletedListener.name);

  constructor(private readonly plateauService: PlateauService) {}

  @OnEvent('session.completed')
  async handleSessionCompleted(payload: SessionCompletedEvent): Promise<void> {
    try {
      await this.plateauService.runDetectionForUser(payload.userId);
    } catch (err) {
      this.logger.error('Plateau detection failed', (err as Error).message);
    }
  }
}
