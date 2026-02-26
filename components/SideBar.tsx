"use client";

import File from "./File";
import ChevronRight from "./svgs/ChevronRight";
import NoteAdd from "./svgs/NoteAdd";

const DUMMY_FILENAMEs = [
  "Todo_list",
  "Read_list",
  "Buy_lists",
  "Things to buy in Delhi",
  "extremely long file name list, it's so long that",
];

const SideBar = () => {
  //improve name later
  const [isTypingFileName, setisTypingFileName] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const loadFiles = (files: string[]) => setFiles(files);
    const filesFromDB = localStorage.getItem("Files");
    if (!filesFromDB) return;
    loadFiles(JSON.parse(filesFromDB));
  }, []);

  return (
    <div className="w-[242px] pt-[20px] pr-[13px] pl-[10px]">
      {/* header  */}
      <div className="flex items-center justify-between border-b pb-[5px] border-b-gray-400">
        <div className="flex items-center gap-0.5">
          <ChevronRight />
          <p className="uppercase font-bold text-sm tracking-wider">
            Your lists
          </p>
        </div>
        <button
          className="cursor-pointer hover:bg-file-hover p-1 rounded-sm"
          onClick={() => setisTypingFileName(true)}
        >
          <NoteAdd />
        </button>
      </div>

      <div className="mt-5">
        {files.map((name, idx) => (
          <File key={idx} name={name} />
        ))}
      </div>
      {isTypingFileName && (
        <FileNameInput
          isTyping={isTypingFileName}
          setIsTyping={setisTypingFileName}
          addFile={setFiles}
        />
      )}
      {/* <FileNameInput
        isTyping={isTypingFileName}
        setIsTyping={setisTypingFileName}
        addFile={setFiles}
      /> */}
    </div>
  );
};

export default SideBar;

//turn into separate component later
//work on the name Claude

import InsertDriveFile from "./svgs/InsertDriveFile";
import { useEffect, useRef, useState } from "react";

export interface FileNameInputProps {
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  addFile: React.Dispatch<React.SetStateAction<string[]>>;
}

function FileNameInput({ isTyping, setIsTyping, addFile }: FileNameInputProps) {
  const [fileName, setFileName] = useState("");
  const [fileAlreadyExists, setFileAlreadyExists] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    if (!fileName.trim()) {
      setIsTyping(false);
      return;
    }

    const existingFiles = localStorage.getItem("Files");
    const files = existingFiles ? JSON.parse(existingFiles) : [];

    if (files.includes(fileName.trim())) {
      setFileAlreadyExists(true);
      return;
    }
    localStorage.setItem("Files", JSON.stringify([...files, fileName.trim()]));
    addFile((files) => [...files, fileName.trim()]);
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
