"use client";

import File from "./File";
import NoteAdd from "./svgs/NoteAdd";
import FileNameInput from "./FileNameInput";
import { useState } from "react";
import SidebarToggle from "./svgs/SidebarToggle";
import ArrowDown from "./svgs/ArrowDown";

interface SideBarProps {
  files: string[];
  activeFile: string | null;
  onFileSelect: (name: string) => void;
  onFileCreate: (name: string) => void;
  onRename: (oldName: string, newName: string) => void;
  onDelete: (name: string) => void;
  isOpened: boolean;
  unSavedFiles: Set<string>;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar = ({
  files,
  activeFile,
  isOpened,
  unSavedFiles,
  onFileSelect,
  onFileCreate,
  onRename,
  onDelete,
  onToggle,
}: SideBarProps) => {
  const [isTypingFileName, setisTypingFileName] = useState(false);
  return (
    <>
      <div
        aria-hidden="true"
        className={`fixed inset-0 bg-black/40 z-10 lg:hidden transition-opacity duration-200 ${isOpened ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => onToggle(false)}
      />

      <nav
        aria-label="File explorer"
        className={`relative shrink-0 transition-all duration-200 ease-in-out 
        ${isOpened ? "w-63.25" : "w-12"}
        max-lg:fixed max-lg:left-0 max-lg:top-0 max-lg:h-full max-lg:w-auto max-lg:z-20`}
      >
        {!isOpened && (
          <div className="flex flex-col items-center pt-6 px-2.5">
            <button
              aria-label="Open sidebar"
              className="cursor-pointer hover:bg-file-hover p-1 rounded-sm"
              onClick={() => onToggle(true)}
            >
              <span aria-hidden="true">
                <SidebarToggle />
              </span>
            </button>
          </div>
        )}

        <div
          className={`absolute top-0 left-0 h-full w-63.25 bg-main transition-transform duration-200 ease-in-out ${isOpened ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="pt-5 pr-3.25 pl-2.5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-1.25 border-b border-b-gray-400 mt-1.75">
              <div className="flex items-center gap-1.25">
                <span aria-hidden="true">
                  <ArrowDown />
                </span>
                <h2 className="uppercase font-bold text-sm tracking-wider whitespace-nowrap">
                  Your lists
                </h2>
              </div>
              <div className="flex gap-1">
                <button
                  aria-label="New file"
                  className="cursor-pointer hover:bg-file-hover p-1 rounded-sm"
                  onClick={() => setisTypingFileName(true)}
                >
                  <span aria-hidden="true">
                    <NoteAdd />
                  </span>
                </button>
                <button
                  aria-label="Close sidebar"
                  className="cursor-pointer hover:bg-file-hover p-1 rounded-sm"
                  onClick={() => onToggle(false)}
                >
                  <span aria-hidden="true">
                    <SidebarToggle />
                  </span>
                </button>
              </div>
            </div>

            {/* file list  */}
            <ul
              className={`mt-5 text-white transition-opacity duration-150 ease-in ${isOpened ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              {files.map((name, idx) => (
                <File
                  key={idx}
                  name={name}
                  onFileSelect={onFileSelect}
                  activeFile={activeFile}
                  onRename={onRename}
                  onDelete={onDelete}
                  unSavedFiles={unSavedFiles}
                />
              ))}
            </ul>

            {isTypingFileName && (
              <FileNameInput
                isTyping={isTypingFileName}
                setIsTyping={setisTypingFileName}
                createFile={onFileCreate}
              />
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideBar;
