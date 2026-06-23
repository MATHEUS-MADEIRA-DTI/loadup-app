import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

/**
 * Represents a single row from the CSV import file
 * Format: nome;grupo_muscular;video_url;dica
 */
export class CsvExerciseRow {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  grupo_muscular: string;

  @IsOptional()
  @IsString()
  video_url?: string;

  @IsOptional()
  @IsString()
  dica?: string;
}

/**
 * Represents a validation error from CSV parsing
 */
export class CsvValidationError {
  row: number; // 1-indexed row number (excluding header)
  field: string; // Field name that failed validation
  message: string; // Error description
}

/**
 * Response from CSV import validation
 */
export class CsvImportValidationResult {
  errors: CsvValidationError[];
  rows: CsvExerciseRow[];
  isValid: boolean;
}

/**
 * Request DTO for CSV import
 */
export class CsvImportRequestDto {
  @IsNotEmpty()
  @IsString()
  dayOfWeek: string; // e.g., 'segunda-feira', 'terça-feira'
}
