import Close from "./svgs/Close";
import InsertDriveFile from "./svgs/InsertDriveFile";

interface TabsProps {
  activeTabs: string[];
  activeFile: string | null;
  onClose: (name: string) => void;
  onSelect: (name: string) => void;
}

const Tabs = ({ activeTabs, activeFile, onClose, onSelect }: TabsProps) => {
  return (
    <div
      role="tablist"
      aria-label="Open files"
      className="flex items-end bg-main border-b-gray-700 borde h-14.75 py-2 overflow-x-scroll custom-scrollbar mb-0.5"
    >
      {/* tab  */}
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
            className="flex items-center w-auto justify-between cursor-pointer group border-r border-white/20  gap-2.5 relative py-1.25 px-1.75"
            onClick={() => onSelect(name)}
          >
            {activeFile === name && (
              <span
                aria-hidden="true"
                className="absolute bg-outline h-px w-full right-0 top-0"
              ></span>
            )}
            <div className="flex gap-1 items-center">
              <span aria-hidden="true">
                <InsertDriveFile />
              </span>
              <span className="select-none">{name}</span>
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
  );
};

export default Tabs;
