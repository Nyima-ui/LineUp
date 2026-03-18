"use client";
import InsertDriveFile from "./svgs/InsertDriveFile";
import { useRef, useState } from "react";
import { loadFiles } from "@/lib/storage";
import Trash from "./svgs/Trash";

interface FileProps {
  name: string;
  activeFile: string | null;
  unSavedFiles: Set<string>;
  onFileSelect: (name: string) => void;
  onRename: (oldName: string, newName: string) => void;
  onDelete: (name: string) => void;
}

const File = ({
  name,
  activeFile,
  unSavedFiles,
  onFileSelect,
  onRename,
  onDelete,
}: FileProps) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [fileAlreadyExists, setfileAlreadyExists] = useState(false);
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDoubleClick(name: string) {
    setIsRenaming(true);
    setNewName(name);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleRename() {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === name) {
      setIsRenaming(false);
      return;
    }

    const files = loadFiles();
    const existingFiles = Object.keys(files);
    if (existingFiles.includes(trimmed)) {
      setfileAlreadyExists(true);
      return;
    }

    onRename(name, trimmed);
    setIsRenaming(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleRename();
    if (e.key === "Escape") {
      setIsRenaming(false);
    }
  }

  function handleBlur() {
    if (!fileAlreadyExists) {
      handleRename();
    }
  }

  return (
    <li className="list-none">
      {isRenaming ? (
        <div className="flex pl-4.5 mt-1.25 gap-1.25 items-center">
          <div className="shrink-0" aria-hidden="true">
            <InsertDriveFile />
          </div>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onBlur={handleBlur}
              onChange={(e) => {
                setNewName(e.currentTarget.value);
                if (fileAlreadyExists) setfileAlreadyExists(false);
              }}
              className="rounded-none text-sm outline-none focus:ring-1 focus:ring-outline"
              onKeyDown={(e) => handleKeyDown(e)}
              aria-label={`Rename ${name}`}
              aria-describedby={fileAlreadyExists ? "rename-error" : undefined}
              aria-invalid={fileAlreadyExists}
            />
            {fileAlreadyExists && (
              <div
                className="absolute top-full text-xs leading-snug bg-red-600 border border-red-700 translate-y w-full p-0.5 rounded-xs"
                role="alert"
              >
                <span id="rename-error">
                  File already exists. Please choose a different file name.
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label={`Open ${name}`}
          aria-current={activeFile === name ? "true" : undefined}
          className={`flex justify-between items-center gap-1.25 cursor-pointer mt-1.25 pl-4.5 hover:bg-file-hover group relative ${activeFile === name ? "bg-file-opened" : ""}`}
          onClick={() => onFileSelect(name)}
          onDoubleClick={() => handleDoubleClick(name)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onFileSelect(name);
          }}
        >
          <div className="flex gap-1.25 items-center min-w-0">
            <div className="shrink-0" aria-hidden="true">
              <InsertDriveFile />
            </div>
            <span className="text-sm font-medium truncate">{name}</span>
          </div>

          {unSavedFiles.has(name) && (
            <span className="size-2 rounded-full bg-outline/70 absolute right-12"></span>
          )}

          <button
            aria-label={`Delete ${name}`}
            tabIndex={0}
            className="pr-4.5 opacity-0 group-hover:opacity-100 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(name);
            }}
          >
            <span aria-hidden="true">
              <Trash />
            </span>
          </button>
        </div>
      )}
    </li>
  );
};

export default File;
