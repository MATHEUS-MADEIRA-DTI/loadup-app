import { Module } from '@nestjs/common';
import { ExercisesApiService } from './exercises-api.service';
import { ExercisesApiController } from './exercises-api.controller';
import { ExerciseDatabaseService } from './services/exercise-database.service';
import { CsvImportService } from './services/csv-import.service';

@Module({
  providers: [ExercisesApiService, ExerciseDatabaseService, CsvImportService],
  controllers: [ExercisesApiController],
  exports: [ExerciseDatabaseService, CsvImportService],
})
export class ExercisesApiModule {}
