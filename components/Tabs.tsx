import Close from "./svgs/Close";
import InsertDriveFile from "./svgs/InsertDriveFile";

interface TabsProps {
  activeTabs: string[];
  activeFile: string | null;
  onClose: (name: string) => void;
  onSelect: (name: string) => void;
}

// className="flex items-end bg-main border-b-gray-700 border-b h-[59px] py-2"
const Tabs = ({ activeTabs, activeFile, onClose, onSelect }: TabsProps) => {
  return (
    <div className="flex items-end bg-main border-b-gray-700 borde h-[59px] py-2 overflow-x-scroll custom-scrollbar mb-0.5">
      {/* tab  */}
      {activeTabs?.map((name, idx) => (
        <div
          key={idx}
          className="flex items-center w-auto justify-between cursor-pointer group border-r border-white/20  gap-2.5 relative py-[5px] px-[7px]"
          onClick={() => onSelect(name)}
        >
          {activeFile === name && (
            <span className="absolute bg-outline h-px w-full right-0 top-0"></span>
          )}
          <div className="flex gap-[4px] items-center">
            <InsertDriveFile />
            <span className="select-none">{name}</span>
          </div>
          <button
            className="cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-file-hover p-0.5 rounded-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClose(name);
            }}
          >
            <Close />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
