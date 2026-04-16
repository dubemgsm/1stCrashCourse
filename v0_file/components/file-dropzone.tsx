"use client";

import { useCallback, useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";

interface FileDropzoneProps {
  onFileLoad: (content: string, filename: string) => void;
}

export function FileDropzone({ onFileLoad }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (
        !file.name.endsWith(".csv") &&
        !file.name.endsWith(".tsv") &&
        !file.name.endsWith(".txt")
      ) {
        alert("Please upload a CSV, TSV, or TXT file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileName(file.name);
        onFileLoad(content, file.name);
      };
      reader.readAsText(file);
    },
    [onFileLoad]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer
        ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50 hover:bg-secondary/50"
        }
      `}
    >
      <input
        type="file"
        accept=".csv,.tsv,.txt"
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-3 text-center">
        {fileName ? (
          <>
            <FileSpreadsheet className="w-10 h-10 text-primary" />
            <div>
              <p className="font-medium text-foreground">{fileName}</p>
              <p className="text-sm text-muted-foreground">
                Drop another file to replace
              </p>
            </div>
          </>
        ) : (
          <>
            <Upload className="w-10 h-10 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">
                Drop your dataset here
              </p>
              <p className="text-sm text-muted-foreground">
                CSV, TSV, or TXT files supported
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
