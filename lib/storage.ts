export type FileStore = Record<string, string>;

export function loadFiles(): FileStore {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem("files");
  return raw ? JSON.parse(raw) : {};
}

export function saveFiles(store: FileStore) {
  localStorage.setItem("files", JSON.stringify(store));
}
