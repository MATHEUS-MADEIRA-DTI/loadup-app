import { apiClient } from "@/lib/apiClient";
import { CsvImportError } from "@/types";

export async function downloadTemplateFile(): Promise<Blob> {
  return apiClient.get<Blob>("/exercises/csv-template");
}

export interface CsvImportResult {
  count: number;
  errors: CsvImportError[];
}

export async function uploadCsvFile(
  file: File,
  dayOfWeek: string,
): Promise<CsvImportResult> {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.postFile<CsvImportResult>(
    `/training-sheet/days/${dayOfWeek}/exercises/import`,
    formData,
  );
}
