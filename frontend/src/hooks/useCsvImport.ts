"use client";

import { useState } from "react";

import { CsvImportError } from "@/types";
import {
  downloadTemplateFile,
  uploadCsvFile,
} from "@/services/csvImportService";

export interface UseCsvImportState {
  selectedFile: File | null;
  isLoading: boolean;
  successCount: number | undefined;
  errors: CsvImportError[];
  error: Error | null;
  setSelectedFile: (file: File | null) => void;
  downloadTemplate: () => Promise<void>;
  importCsv: (file: File, dayOfWeek: string) => Promise<void>;
  reset: () => void;
}

export function useCsvImport(): UseCsvImportState {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successCount, setSuccessCount] = useState<number | undefined>(
    undefined,
  );
  const [errors, setErrors] = useState<CsvImportError[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const downloadTemplate = async (): Promise<void> => {
    try {
      const blob = await downloadTemplateFile();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "template-exercicios.csv";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Erro ao baixar template"),
      );
    }
  };

  const importCsv = async (file: File, dayOfWeek: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSuccessCount(undefined);
    setErrors([]);

    try {
      const result = await uploadCsvFile(file, dayOfWeek);
      setSuccessCount(result.count);
      setErrors(result.errors);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erro ao importar CSV"));
    } finally {
      setIsLoading(false);
    }
  };

  const reset = (): void => {
    setSelectedFile(null);
    setIsLoading(false);
    setSuccessCount(undefined);
    setErrors([]);
    setError(null);
  };

  return {
    selectedFile,
    isLoading,
    successCount,
    errors,
    error,
    setSelectedFile,
    downloadTemplate,
    importCsv,
    reset,
  };
}
