import Close from "./svgs/Close";
import InsertDriveFile from "./svgs/InsertDriveFile";
import Image from "next/image";
import Link from "next/link";

interface TabsProps {
  activeTabs: string[];
  activeFile: string | null;
  unSavedFiles: Set<string>;
  onClose: (name: string) => void;
  onSelect: (name: string) => void;
  onSequence: () => void;
}

const Tabs = ({
  activeTabs,
  activeFile,
  unSavedFiles,
  onClose,
  onSelect,
  onSequence,
}: TabsProps) => {
  return (
    <div
      role="tablist"
      aria-label="Open files"
      className="flex items-end justify-between bg-main border-b-gray-700 borde h-14.75 pt-2 overflow-x-scroll custom-scrollbar relative"
    >
      {/* tab  */}
      <div className="flex pr-13">
        {activeTabs?.map((name, idx) => {
          const isActive = activeFile === name;
          return (
            <div
              key={idx}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(name);
              }}
              className={`flex items-center justify-between cursor-pointer group border-r border-white/20 gap-2.5 relative py-1.25 px-1.75 w-37.5 ${activeFile === name ? "bg-file-hover" : ""}`}
              onClick={() => onSelect(name)}
            >
              {activeFile === name && (
                <span
                  aria-hidden="true"
                  className="absolute bg-outline h-px w-full right-0 top-0"
                ></span>
              )}
              {unSavedFiles.has(name) && (
                <span className="absolute bg-outline size-2 rounded-full -top-0.5 -right-0.5"></span>
              )}
              <div className="flex gap-1 items-center min-w-0">
                <span aria-hidden="true">
                  <InsertDriveFile />
                </span>
                <span className="select-none truncate">{name}</span>
              </div>
              <button
                aria-label={`Close ${name}`}
                className="cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-file-hover p-0.5 rounded-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(name);
                }}
              >
                <span aria-hidden="true">
                  <Close />
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <button
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onSequence();
        }}
      >
        Renumber
      </button>
      <Link
        href="https://github.com/Nyima-ui/LineUp"
        target="_blank"
        className="cursor-pointer"
      >
        <Image height={28} width={28} src="/github.svg" alt="Github" />
      </Link>
    </div>
  );
};

export default Tabs;
