"use client";
import { useState, useRef, useEffect } from "react";
import { loadFiles } from "@/lib/storage";
import InsertDriveFile from "./svgs/InsertDriveFile";

export interface FileNameInputProps {
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  createFile: (value: string) => void;
}

const FileNameInput = ({ setIsTyping, createFile }: FileNameInputProps) => {
  const [fileName, setFileName] = useState("");
  const [fileAlreadyExists, setFileAlreadyExists] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  function handleSave() {
    if (!fileName.trim()) {
      setIsTyping(false);
      return;
    }

    const files = loadFiles();
    const existingFiles = Object.keys(files);

    if (existingFiles.includes(fileName.trim())) {
      setFileAlreadyExists(true);
      return;
    }
    createFile(fileName.trim());
    setIsTyping(false);
  }

  function handleBlur() {
    if (fileAlreadyExists) {
      setFileName("");
      setIsTyping(false);
      setFileAlreadyExists(false);
    } else {
      handleSave();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSave();
    else if (e.key === "Escape") {
      setFileName("");
      setIsTyping(false);
    }
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex pl-4.5 mt-1.25 gap-1.25 items-center">
      <div className="shrink-0" aria-hidden="true">
        <InsertDriveFile />
      </div>
      <div className="relative">
        <input
          type="text"
          value={fileName}
          onBlur={handleBlur}
          onChange={(e) => {
            setFileName(e.currentTarget.value);
            if (fileAlreadyExists) setFileAlreadyExists(false);
          }}
          className="rounded-none text-sm outline-none focus:ring-1 focus:ring-outline"
          ref={inputRef}
          onKeyDown={(e) => handleKeyDown(e)}
          aria-label="New file name"
          aria-describedby={fileAlreadyExists ? "filename-error" : undefined}
          aria-invalid={fileAlreadyExists || undefined}
        />
        {fileAlreadyExists && (
          <div className="absolute top-full text-xs leading-snug bg-red-600 border border-red-700 translate-y w-full p-0.5 rounded-xs">
            <span id="filename-error">
              File already exists. Please choose a different file name.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileNameInput;
