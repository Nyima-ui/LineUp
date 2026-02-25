import InsertDriveFile from "./svgs/InsertDriveFile";

const File = ({ name }: { name: string }) => {
  return (
    <div className="flex gap-[5px] cursor-pointer hover:bg-file-hover mt-[5px] pl-[18px]">
      <div className="shrink-0">
        <InsertDriveFile />
      </div>
      <span className="text-sm font-medium truncate">{name}</span>
    </div>
  );
};

export default File;
