"use client";
import Bars from "@/components/svgs/Bars";
import { useState } from "react";

interface SidebarProps {
  isOpened: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

// className="cursor-pointer border border-white absolute top-0 "
function Sidebar({ isOpened, onToggle }: SidebarProps) {
  return (
    <div
      className={`bg-file-opened relative transition-all duration-100 ease-in
          max-lg:absolute max-lg:h-full
        ${isOpened ? "w-[242px]" : "w-[42px]"}`}
    >
      <button
        className="flex w-full justify-end cursor-pointer"
        onClick={() => onToggle(!isOpened)}
      >
        <Bars />
      </button>
      <div
        className={`text-white whitespace-nowrap transition-opacity duration-100 ease-in ${isOpened ? "opacity-100" : "opacity-0"}`}
      >
        <p>some text, random text</p>
        <p>some text, random text</p>
        <p>some text, random text</p>
      </div>
    </div>
  );
}

function EditorR() {
  return (
    <div className="flex-1 bg-gray-400 min-w-0">
      <p>some text, random text</p>
      <p>some text, random text</p>
      <p>some text, random text</p>
    </div>
  );
}

const Page = () => {
  const [isSideBarOpened, setisSideBarOpened] = useState(false);
  return (
    <div className="bg-main min-h-screen flex relative">
      <Sidebar isOpened={isSideBarOpened} onToggle={setisSideBarOpened} />
      <EditorR />
    </div>
  );
};

export default Page;


