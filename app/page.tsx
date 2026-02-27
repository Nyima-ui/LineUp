"use client";
import { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import MonacoEditor from "@/components/Editor";
import { type FileStore, loadFiles, saveFiles } from "@/lib/storage";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [files, setFiles] = useState<FileStore>({});
  const [activeFile, setActiveFile] = useState<string | null>(null);

  function handleFileSelect(name: string) {
    setActiveFile(name);
  }

  function handleFileCreate(name: string) {
    setFiles((prev) => {
      const updated = { ...prev, [name]: "" };
      saveFiles(updated);
      return updated;
    });
    setActiveFile(name);
  }

  function handleMarkDownChange(value: string) {
    if (!activeFile) return;
    setFiles((prev) => {
      const updated = { ...prev, [activeFile]: value };
      saveFiles(updated);
      return updated;
    });
  }

  useEffect(() => {
    const loaded = loadFiles();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFiles(loaded);
    setActiveFile(Object.keys(loaded)[0] ?? null);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="text-foreground bg-background flex bg-main h-screen overflow-hidden">
      <SideBar
        files={Object.keys(files)}
        activeFile={activeFile}
        onFileSelect={handleFileSelect}
        onFileCreate={handleFileCreate}
      />

      <div className="flex text-sm leading-4.75 flex-1 bg-editor min-w-0">
        <MonacoEditor
          value={activeFile ? files[activeFile] : ""}
          onChange={handleMarkDownChange}
          disabled={!activeFile}
        />
      </div>
    </div>
  );
}
