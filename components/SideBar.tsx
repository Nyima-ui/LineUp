'use client'

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
        <button className="cursor-pointer hover:bg-file-hover p-1 rounded-sm">
          <NoteAdd />
        </button>
      </div>

      <div className="mt-5">
        {DUMMY_FILENAMEs.map((name, idx) => (
          <File key={idx} name={name} />
        ))}
      </div>
      <GetFileName />
    </div>
  );
};

export default SideBar;

//turn into separate component later
//work on the name Claude

import InsertDriveFile from "./svgs/InsertDriveFile";
import { useState } from "react";
function GetFileName() {
 const [fileName, setFileName] = useState("")
  return (
    <div className="flex pl-[18px] mt-[5px] gap-[5px]">
      <div className="shrink-0">
        <InsertDriveFile />
      </div>
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.currentTarget.value)}
        className="rounded-none text-sm outline-none focus:ring-1 focus:ring-outline"
      />
    </div>
  );
}
