"use client";

import File from "./File";
import NoteAdd from "./svgs/NoteAdd";
import { loadFiles } from "@/lib/storage";

interface SideBarProps {
  files: string[];
  activeFile: string | null;
  onFileSelect: (name: string) => void;
  onFileCreate: (name: string) => void;
  onRename: (oldName: string, newName: string) => void;
  onDelete: (name: string) => void;
  isOpened: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar = ({
  files,
  activeFile,
  isOpened,
  onFileSelect,
  onFileCreate,
  onRename,
  onDelete,
  onToggle,
}: SideBarProps) => {
  const [isTypingFileName, setisTypingFileName] = useState(false);

  // className="flex items-center justify-between border-b pb-[5px] border-b-gray-400"
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-10 lg:hidden transition-opacity duration-200 ${isOpened ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => onToggle(false)}
      />

      <div
        className={`relative shrink-0 transition-all duration-200 ease-in-out 
        ${isOpened ? "w-[253px]" : "w-[48px]"}
        max-lg:fixed max-lg:left-0 max-lg:top-0 max-lg:h-full max-lg:w-auto max-lg:z-20`}
      >
        {!isOpened && (
          <div className="flex flex-col items-center pt-[24px] px-[10px] ">
            <button
              className="cursor-pointer hover:bg-file-hover p-1 rounded-sm"
              onClick={() => onToggle(true)}
            >
              <SidebarToggle />
            </button>
          </div>
        )}

        <div
          className={`absolute top-0 left-0 h-full w-[253px] bg-main transition-transform duration-200 ease-in-out ${isOpened ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="pt-[20px] pr-[13px] pl-[10px] h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-[5px] border-b border-b-gray-400 mt-[7px]">
              <div className="flex items-center gap-[5px]">
                <ArrowDown />
                <p className="uppercase font-bold text-sm tracking-wider whitespace-nowrap">
                  Your lists
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  className="cursor-pointer hover:bg-file-hover p-1 rounded-sm"
                  onClick={() => setisTypingFileName(true)}
                >
                  <NoteAdd />
                </button>
                <button
                  className="cursor-pointer hover:bg-file-hover p-1 rounded-sm"
                  onClick={() => onToggle(false)}
                >
                  <SidebarToggle />
                </button>
              </div>
            </div>

            {/* file list  */}
            <div
              className={`mt-5 text-white overflow-y-auto transition-opacity duration-150 ease-in ${isOpened ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              {files.map((name, idx) => (
                <File
                  key={idx}
                  name={name}
                  onFileSelect={onFileSelect}
                  activeFile={activeFile}
                  onRename={onRename}
                  onDelete={onDelete}
                />
              ))}
            </div>

            {isTypingFileName && (
              <FileNameInput
                isTyping={isTypingFileName}
                setIsTyping={setisTypingFileName}
                createFile={onFileCreate}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;

//turn into separate component later
//work on the name Claude

import InsertDriveFile from "./svgs/InsertDriveFile";
import { useEffect, useRef, useState } from "react";
import SidebarToggle from "./svgs/SidebarToggle";
import ArrowDown from "./svgs/ArrowDown";

export interface FileNameInputProps {
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  createFile: (value: string) => void;
}

export function FileNameInput({
  isTyping,
  setIsTyping,
  createFile,
}: FileNameInputProps) {
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

  useEffect(() => {
    // console.log(fileName);
  }, [fileName]);

  return (
    <div className="flex pl-[18px] mt-[5px] gap-[5px]">
      <div className="shrink-0">
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
  );
}
