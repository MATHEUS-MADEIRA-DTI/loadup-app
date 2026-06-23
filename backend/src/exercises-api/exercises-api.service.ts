import { Injectable, Logger } from '@nestjs/common';
import { SearchExercisesDto, SearchExercisesResponseDto } from './dto/search-exercises.dto';
import { ExerciseResultDto } from './dto/exercise-result.dto';
import { ExerciseDatabaseService } from './services/exercise-database.service';

@Injectable()
export class ExercisesApiService {
  private readonly logger = new Logger(ExercisesApiService.name);

  constructor(private readonly databaseService: ExerciseDatabaseService) {}

  async search(dto: SearchExercisesDto): Promise<SearchExercisesResponseDto> {
    try {
      // Search local database
      const exercises = this.databaseService.search(dto.name, dto.muscle);

      // Map to DTO
      const results: ExerciseResultDto[] = exercises.map((exercise) => ({
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        videoUrl: exercise.videoUrl,
        tip: exercise.tip,
      }));

      this.logger.log(
        `[LocalSearch] Filters: name="${dto.name}", muscle="${dto.muscle}" → Found ${results.length} results`,
      );

      return {
        results,
        cached: false,
        warning: null,
      };
    } catch (error) {
      this.logger.error(`Search failed: ${error instanceof Error ? error.message : String(error)}`);
      return {
        results: [],
        cached: false,
        warning: 'Erro ao buscar exercícios no banco de dados local',
      };
    }
  }
}
