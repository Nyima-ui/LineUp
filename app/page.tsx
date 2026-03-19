"use client";
import { useEffect, useRef, useState } from "react";
import SideBar from "@/components/SideBar";
import MonacoEditor from "@/components/Editor";
import { type FileStore, loadFiles, saveFiles } from "@/lib/storage";
import Tabs from "@/components/Tabs";
import Image from "next/image";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [files, setFiles] = useState<FileStore>({});
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [activeTabs, setActiveTabs] = useState<string[]>([]);
  const [tabHistory, setTabHistory] = useState<string[]>([]);
  const [isSideBarOpened, setisSideBarOpened] = useState(false);
  const [unSavedFiles, setUnSavedFiles] = useState<Set<string>>(new Set());
  const onSaveRef = useRef<() => void>(() => {});

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
    setFiles((prev) => ({ ...prev, [activeFile]: value }));
    setUnSavedFiles((prev) => new Set(prev).add(activeFile));
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

  useEffect(() => {
    onSaveRef.current = () => {
      if (!activeFile) return;
      saveFiles(files);
      setUnSavedFiles((prev) => {
        const next = new Set(prev);
        next.delete(activeFile);
        return next;
      });
    };
  }, [activeFile, files]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        onSaveRef.current?.();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (unSavedFiles.size > 0) {
        e.preventDefault();
      }
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [unSavedFiles]);

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

    setActiveTabs((prev) => prev.map((t) => (t === oldName ? newName : t)));
    setTabHistory((prev) => prev.map((t) => (t === oldName ? newName : t)));
  }

  function handleDelete(name: string) {
    const files = loadFiles();
    delete files[name];
    saveFiles(files);
    handleCloseTab(name);
    setFiles(files);
  }

  function autoNumber() {
    if (!activeFile) return;
    let counter = 1;
    const list = files[activeFile];

    const sequencedList = list
      .split("\n")
      .map((line) => {
        if (/^\d+\./.test(line)) {
          return line.replace(/^\d+\./, `${counter++}.`);
        }
        return line;
      })
      .join("\n");

    setFiles((prev) => ({ ...prev, [activeFile]: sequencedList }));
    if (list === sequencedList) return;
    setUnSavedFiles((prev) => new Set(prev).add(activeFile));
  }

  if (!mounted) return null;

  return (
    <div className="text-foreground bg-background flex bg-main h-screen overflow-hidden relative">
      <SideBar
        files={Object.keys(files)}
        activeFile={activeFile}
        onFileSelect={handleFileSelect}
        onFileCreate={handleFileCreate}
        onRename={handleRename}
        onDelete={handleDelete}
        isOpened={isSideBarOpened}
        onToggle={setisSideBarOpened}
        unSavedFiles={unSavedFiles}
      />

      <main className="flex-1 min-w-0 max-lg:ml-13.25" aria-label="Editor">
        {activeTabs && activeTabs.length > 0 ? (
          <div className="text-sm leading-4.75 flex flex-col h-full bg-editor">
            <Tabs
              activeTabs={activeTabs}
              activeFile={activeFile}
              onClose={handleCloseTab}
              onSelect={handleFileSelect}
              unSavedFiles={unSavedFiles}
              onSequence={autoNumber}
            />
            <MonacoEditor
              value={activeFile ? files[activeFile] : ""}
              onChange={handleMarkDownChange}
              disabled={!activeFile}
              onSaveRef={onSaveRef}
            />
          </div>
        ) : (
          <div
            className="flex-1 bg-editor font-sans flex items-center justify-center h-full"
            role="status"
          >
            <div className="flex justify-center items-center flex-col">
              <h1 className="font-mono max-md:px-5 max-md:text-center">
                No file open — create or select a file from the sidebar
              </h1>
              <Image height={325} width={325} src="/logo.svg" alt="Logo" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
