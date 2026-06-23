"use client";

import { useRef } from "react";

import { strings } from "@/constants/strings";
import { useCsvImport } from "@/hooks/useCsvImport";
import {
  CsvContainer,
  ButtonGroup,
  DownloadButton,
  FileInput,
  UploadButton,
  ResultsArea,
  SuccessMessage,
  ErrorList,
  ErrorItem,
  ErrorRow,
  ErrorField,
  ErrorMessage,
  InstructionText,
  LoadingIndicator,
} from "./styles";

interface CsvImportTabProps {
  dayOfWeek: string;
}

export function CsvImportTab({ dayOfWeek }: CsvImportTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    selectedFile,
    isLoading,
    successCount,
    errors,
    error,
    setSelectedFile,
    downloadTemplate,
    importCsv,
  } = useCsvImport();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await importCsv(selectedFile, dayOfWeek);
  };

  const hasResults = successCount !== undefined && errors.length === 0;
  const hasErrors = errors.length > 0;

  return (
    <CsvContainer>
      <ButtonGroup>
        <DownloadButton onClick={downloadTemplate} disabled={isLoading}>
          {strings.csvImport.downloadTemplate}
        </DownloadButton>
        <FileInput
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          disabled={isLoading}
          aria-label="Select CSV file"
        />
        <UploadButton
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? "Enviando..." : strings.csvImport.uploadButton}
        </UploadButton>
      </ButtonGroup>

      {isLoading && <LoadingIndicator />}

      <ResultsArea>
        {hasResults && (
          <>
            <SuccessMessage>
              {successCount} {strings.csvImport.success}
            </SuccessMessage>
            <InstructionText>{strings.csvImport.instruction}</InstructionText>
          </>
        )}

        {hasErrors && (
          <ErrorList>
            {errors.map((err, idx) => (
              <ErrorItem key={idx}>
                <ErrorRow>
                  <strong>Linha {err.row}:</strong>
                </ErrorRow>
                <ErrorField>{err.field}</ErrorField>
                <ErrorMessage>{err.message}</ErrorMessage>
              </ErrorItem>
            ))}
          </ErrorList>
        )}

        {error && (
          <ErrorMessage style={{ color: "red", marginTop: "1rem" }}>
            {strings.csvImport.errorTitle}: {error.message}
          </ErrorMessage>
        )}

        {!hasResults &&
          !hasErrors &&
          !isLoading &&
          successCount === undefined && (
            <InstructionText style={{ marginTop: "1rem", fontStyle: "italic" }}>
              Selecione um arquivo CSV para importar exercícios
            </InstructionText>
          )}
      </ResultsArea>
    </CsvContainer>
  );
}
