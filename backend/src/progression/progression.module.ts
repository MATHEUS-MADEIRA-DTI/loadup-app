import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressionController } from './progression.controller';
import { ProgressionService } from './progression.service';
import {
  TrainingSession,
  TrainingSessionSchema,
} from '../training-session/schemas/training-session.schema';
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
  controllers: [ProgressionController],
  providers: [ProgressionService],
})
export class ProgressionModule {}
