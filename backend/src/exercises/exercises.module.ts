import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import {
  TrainingSheet,
  TrainingSheetSchema,
} from '../training-sheet/schemas/training-sheet.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: TrainingSheet.name, schema: TrainingSheetSchema }])],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
