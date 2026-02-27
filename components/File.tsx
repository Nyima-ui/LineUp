"use client";
import InsertDriveFile from "./svgs/InsertDriveFile";
import { useRef, useState } from "react";
import { loadFiles } from "@/lib/storage";

interface FileProps {
  name: string;
  activeFile: string | null;
  onFileSelect: (name: string) => void;
  onRename: (oldName: string, newName: string) => void;
}

const File = ({ name, activeFile, onFileSelect, onRename }: FileProps) => {
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
    <>
      {isRenaming ? (
        <div className="flex pl-[18px] mt-[5px] gap-[5px]">
          <div className="shrink-0">
            <InsertDriveFile />
          </div>
          <div className="relative">
            <input
              type="text"
              value={newName}
              onBlur={handleBlur}
              onChange={(e) => {
                setNewName(e.currentTarget.value);
                if (fileAlreadyExists) setfileAlreadyExists(false);
              }}
              className="rounded-none text-sm outline-none focus:ring-1 focus:ring-outline"
              ref={inputRef}
              onKeyDown={(e) => handleKeyDown(e)}
            />
            {fileAlreadyExists && (
              <div className="absolute top-full text-xs leading-snug bg-red-600 border border-red-700 translate-y w-full p-0.5 rounded-xs">
                <span>
                  File already exists. Please choose a different file name.
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`flex gap-[5px] cursor-pointer mt-[5px] pl-[18px] hover:bg-file-hover ${activeFile === name ? "bg-file-opened" : ""}`}
          onClick={() => onFileSelect(name)}
          onDoubleClick={() => handleDoubleClick(name)}
        >
          <div className="shrink-0">
            <InsertDriveFile />
          </div>
          <span className="text-sm font-medium truncate">{name}</span>
        </div>
      )}
    </>
  );
};

export default File;
