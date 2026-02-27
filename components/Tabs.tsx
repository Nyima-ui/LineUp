import React, { SetStateAction } from "react";
import Close from "./svgs/Close";
import InsertDriveFile from "./svgs/InsertDriveFile";

interface TabsProps {
  activeTabs: string[];
  activeFile: string | null;
  onClose: (name: string) => void;
  onSelect: React.Dispatch<SetStateAction<string | null>>;
}

const Tabs = ({ activeTabs, activeFile, onClose, onSelect }: TabsProps) => {
  return (
    <div className="flex items-end bg-main border-b-gray-400 border-b h-[59px]">
      {/* tab  */}
      {activeTabs?.map((name, idx) => (
        <div
          key={idx}
          className="flex items-center w-auto h-[30px] justify-between cursor-pointer group border-r border-white/20 px-1 gap-2.5 relative"
          onClick={() => onSelect(name)}
        >
          {activeFile === name && <span className="absolute bg-outline h-px w-full right-0 top-0"></span>}
          <div className="flex gap-[5px] items-center">
            <InsertDriveFile />
            <span className="select-none">{name}</span>
          </div>
          <button
            className="cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-file-opened p-0.5"
            onClick={() => onClose(name)}
          >
            <Close />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
