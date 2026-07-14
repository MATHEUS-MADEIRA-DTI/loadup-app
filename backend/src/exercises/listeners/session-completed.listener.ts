import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ExercisesService } from '../exercises.service';
import { SessionCompletedEvent } from '../../training-session/training-session.service';

@Injectable()
export class ExerciseSuggestionsSyncListener {
  private readonly logger = new Logger(ExerciseSuggestionsSyncListener.name);

  constructor(private readonly exercisesService: ExercisesService) {}

  @OnEvent('session.completed')
  async handleSessionCompleted(payload: SessionCompletedEvent): Promise<void> {
    try {
      await this.exercisesService.syncSuggestionsFromSession(
        payload.userId,
        payload.dayOfWeek,
        payload.records,
      );
    } catch (err) {
      this.logger.error(
        'Failed to sync suggested weights from completed session',
        (err as Error).message,
      );
    }
  }
}
