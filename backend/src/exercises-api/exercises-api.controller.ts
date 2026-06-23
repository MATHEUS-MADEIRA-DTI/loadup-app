import { BadRequestException, Controller, Get, Query, UseGuards, Response } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { ExercisesApiService } from './exercises-api.service';
import { CsvImportService } from './services/csv-import.service';
import { ExerciseDatabaseService } from './services/exercise-database.service';
import { SearchExercisesDto, SearchExercisesResponseDto } from './dto/search-exercises.dto';

@Controller('exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesApiController {
  constructor(
    private readonly exercisesApiService: ExercisesApiService,
    private readonly csvImportService: CsvImportService,
    private readonly databaseService: ExerciseDatabaseService,
  ) {}

  @Get('search')
  async search(@Query() dto: SearchExercisesDto): Promise<SearchExercisesResponseDto> {
    if (!dto.name && !dto.muscle) {
      throw new BadRequestException(
        "Pelo menos um dos parâmetros 'name' ou 'muscle' deve ser fornecido",
      );
    }
    return this.exercisesApiService.search(dto);
  }

  @Get('csv-template')
  csvTemplate(@Response() res: any): void {
    const muscleGroups = this.databaseService.getMuscleGroups();

    // Generate CSV content with header and example rows
    const lines: string[] = [
      // Header
      'nome;grupo_muscular;video_url;dica',
      // Example rows (one for each muscle group)
      ...muscleGroups.map(
        (muscle) =>
          `Exercício de ${muscle};${muscle};https://youtube.com/watch?v=exemplo;Dica do exercício`,
      ),
    ];

    const csvContent = lines.join('\n');

    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.header('Content-Disposition', 'attachment; filename="exercicios-template.csv"');
    res.send(csvContent);
  }
}
