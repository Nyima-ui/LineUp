import InsertDriveFile from "./svgs/InsertDriveFile";

interface FileProps {
  name: string;
  activeFile: string | null;
  onFileSelect: (name: string) => void;
}

const File = ({ name, activeFile, onFileSelect }: FileProps) => {
  return (
    <div
      className={`flex gap-[5px] cursor-pointer mt-[5px] pl-[18px] hover:bg-file-hover ${activeFile === name ? "bg-file-opened" : ""}`}
      onClick={() => onFileSelect(name)}
    >
      <div className="shrink-0">
        <InsertDriveFile />
      </div>
      <span className="text-sm font-medium truncate">{name}</span>
    </div>
  );
};

export default File;
