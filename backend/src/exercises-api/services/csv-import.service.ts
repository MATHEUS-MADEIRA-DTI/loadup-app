import { Injectable, Logger } from '@nestjs/common';
import {
  CsvExerciseRow,
  CsvValidationError,
  CsvImportValidationResult,
} from '../dto/csv-import.dto';
import { ExerciseDatabaseService } from './exercise-database.service';

@Injectable()
export class CsvImportService {
  private readonly logger = new Logger(CsvImportService.name);

  constructor(private readonly databaseService: ExerciseDatabaseService) {}

  /**
   * Validate and parse CSV file buffer
   * CSV Format: nome;grupo_muscular;video_url;dica
   * Returns all validation errors collected from the entire file
   */
  validateCsvFile(buffer: Buffer): CsvImportValidationResult {
    const errors: CsvValidationError[] = [];
    const rows: CsvExerciseRow[] = [];

    try {
      const content = buffer.toString('utf-8').trim();
      const lines = content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length < 2) {
        errors.push({
          row: 0,
          field: 'file',
          message: 'Arquivo CSV vazio ou sem dados',
        });
        return { errors, rows, isValid: false };
      }

      // Skip header line, process data lines
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const fields = line.split(';').map((f) => f.trim());

        if (fields.length < 2) {
          errors.push({
            row: i,
            field: 'format',
            message: 'Linha com menos de 2 campos (mínimo: nome;grupo_muscular)',
          });
          continue;
        }

        const [nome, grupo_muscular, video_url, dica] = fields;

        // Validate required fields
        if (!nome || nome.length === 0) {
          errors.push({
            row: i,
            field: 'nome',
            message: 'Campo "nome" é obrigatório',
          });
        }

        if (!grupo_muscular || grupo_muscular.length === 0) {
          errors.push({
            row: i,
            field: 'grupo_muscular',
            message: 'Campo "grupo_muscular" é obrigatório',
          });
        }

        // Validate muscle group exists in database
        const validMuscleGroups = this.databaseService.getMuscleGroups();
        if (grupo_muscular && !validMuscleGroups.includes(grupo_muscular)) {
          errors.push({
            row: i,
            field: 'grupo_muscular',
            message: `"${grupo_muscular}" não é um grupo muscular válido. Válidos: ${validMuscleGroups.join(', ')}`,
          });
        }

        // If there are errors for this row, don't add it to rows
        if (
          !nome ||
          !grupo_muscular ||
          (grupo_muscular && !validMuscleGroups.includes(grupo_muscular))
        ) {
          continue;
        }

        // Build validated row
        const row: CsvExerciseRow = {
          nome,
          grupo_muscular,
          video_url: video_url && video_url.length > 0 ? video_url : undefined,
          dica: dica && dica.length > 0 ? dica : undefined,
        };

        rows.push(row);
      }

      const isValid = errors.length === 0;
      this.logger.log(`CSV Validation: ${rows.length} valid rows, ${errors.length} errors`);

      return { errors, rows, isValid };
    } catch (error) {
      this.logger.error(
        `CSV parsing failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      errors.push({
        row: 0,
        field: 'file',
        message: `Erro ao processar arquivo: ${error instanceof Error ? error.message : String(error)}`,
      });
      return { errors, rows, isValid: false };
    }
  }
}
