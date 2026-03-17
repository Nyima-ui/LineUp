"use client";
import { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import MonacoEditor from "@/components/Editor";
import { type FileStore, loadFiles, saveFiles } from "@/lib/storage";
import Tabs from "@/components/Tabs";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [files, setFiles] = useState<FileStore>({});
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [activeTabs, setActiveTabs] = useState<string[]>([]);
  const [tabHistory, setTabHistory] = useState<string[]>([]);

  function handleFileSelect(name: string) {
    setActiveFile(name);
    setTabHistory((prev) => [...prev.filter((t) => t !== name), name]);
    setActiveTabs((prev) => {
      if (prev.includes(name)) return prev;
      return [...prev, name];
    });
  }

  function handleCloseTab(name: string) {
    setActiveTabs((prev) => prev.filter((t) => t !== name));
    setTabHistory((prev) => prev.filter((t) => t !== name));

    if (activeFile === name) {
      const history = tabHistory.filter((t) => t !== name);
      setActiveFile(history.at(-1) ?? null);
    }
  }

  function handleFileCreate(name: string) {
    setFiles((prev) => {
      const updated = { ...prev, [name]: "" };
      saveFiles(updated);
      return updated;
    });
    setActiveFile(name);
    setActiveTabs((prev) => [...prev, name]);
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
    const firstFile = Object.keys(loaded)[0];
    setActiveFile(firstFile ?? null);
    setActiveTabs(firstFile ? [firstFile] : []);
    setTabHistory(firstFile ? [firstFile] : []);
    setMounted(true);
  }, []);

  function handleRename(oldName: string, newName: string) {
    setFiles((prev) => {
      const updated: FileStore = {};
      for (const [key, value] of Object.entries(prev)) {
        updated[key === oldName ? newName : key] = value;
      }
      saveFiles(updated);
      return updated;
    });
    if (activeFile === oldName) setActiveFile(newName);
  }

  function handleDelete(name: string) {
    const files = loadFiles();
    delete files[name];
    saveFiles(files);
    handleCloseTab(name);
    setFiles(files);
  }

  useEffect(() => {
    console.log("activeTabs", activeTabs);
  }, [activeTabs]);

  if (!mounted) return null;

  return (
    <div className="text-foreground bg-background flex bg-main h-screen overflow-hidden">
      <SideBar
        files={Object.keys(files)}
        activeFile={activeFile}
        onFileSelect={handleFileSelect}
        onFileCreate={handleFileCreate}
        onRename={handleRename}
        onDelete={handleDelete}
      />

      {activeTabs && activeTabs.length > 0 ? (
        <div className="text-sm leading-4.75 flex-1 bg-editor min-w-0">
          <Tabs
            activeTabs={activeTabs}
            activeFile={activeFile}
            onClose={handleCloseTab}
            onSelect={handleFileSelect}
          />
          <MonacoEditor
            value={activeFile ? files[activeFile] : ""}
            onChange={handleMarkDownChange}
            disabled={!activeFile}
          />
        </div>
      ) : (
        <div className="flex-1 bg-editor font-sans flex items-center justify-center">
          change this later
        </div>
      )}
    </div>
  );
}
