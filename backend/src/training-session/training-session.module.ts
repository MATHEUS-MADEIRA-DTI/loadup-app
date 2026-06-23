import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainingSessionController } from './training-session.controller';
import { TrainingSessionService } from './training-session.service';
import { TrainingSession, TrainingSessionSchema } from './schemas/training-session.schema';
import {
  TrainingSheet,
  TrainingSheetSchema,
} from '../training-sheet/schemas/training-sheet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrainingSession.name, schema: TrainingSessionSchema },
      { name: TrainingSheet.name, schema: TrainingSheetSchema },
    ]),
  ],
  controllers: [TrainingSessionController],
  providers: [TrainingSessionService],
  exports: [TrainingSessionService],
})
export class TrainingSessionModule {}
