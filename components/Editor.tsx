"use client";
import { Editor } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import type * as MonacoType from "monaco-editor";

declare global {
  interface Window {
    __monaco: typeof MonacoType;
  }
}

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const MonacoEditor = ({ value, onChange }: MonacoEditorProps) => {
  const editorRef = useRef<MonacoType.editor.IStandaloneCodeEditor | null>(
    null,
  );
  const decorationsRef =
    useRef<MonacoType.editor.IEditorDecorationsCollection | null>(null);

  function applyBracketDecorations(
    editor: MonacoType.editor.IStandaloneCodeEditor,
    monaco: typeof MonacoType,
    value: string,
  ) {
    const model = editor.getModel();
    if (!model) return;

    const decorations: MonacoType.editor.IModelDeltaDecoration[] = [];
    const regex = /\[([^\]]*)\]/g;
    let match;

    while ((match = regex.exec(value)) !== null) {
      const startPos = model.getPositionAt(match.index);
      const endPos = model.getPositionAt(match.index + match[0].length);

      decorations.push({
        range: new monaco.Range(
          startPos.lineNumber,
          startPos.column + 1,
          endPos.lineNumber,
          endPos.column - 1,
        ),
        options: {
          inlineClassName: "bracket-orange",
        },
      });
    }

    if (decorationsRef.current) {
      decorationsRef.current.set(decorations);
    } else {
      decorationsRef.current = editor.createDecorationsCollection(decorations);
    }
  }

  function handleEditorChange(value: string | undefined) {
    const newValue = value || "";
    onChange(newValue);

    if (editorRef.current) {
      // Access monaco from the global scope set during mount
      applyBracketDecorations(editorRef.current, window.__monaco, newValue);
    }
  }

  function handleEditorDidMount(
    editor: MonacoType.editor.IStandaloneCodeEditor,
    monaco: typeof MonacoType,
  ) {
    editorRef.current = editor;
    window.__monaco = monaco; // stash for use in onChange

    monaco.editor.defineTheme("my-markdown-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "string.link.md", foreground: "FFFFFF" },
        { token: "delimiter.square.markdown", foreground: "FFFFFF" },
      ],
      colors: {
        "editor.foreground": "#D4D4D4",
        "editor.background": "#1E1E1E",
      },
    });

    monaco.editor.setTheme("my-markdown-theme");

    // Apply on initial value
    applyBracketDecorations(editor, monaco, value);
  }

  useEffect(() => {
    if (editorRef.current && window.__monaco) {
      applyBracketDecorations(editorRef.current, window.__monaco, value);
    }
  }, [value]);
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="markdown"
        value={value}
        theme="my-markdown-theme"
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          folding: false,
        }}
      />
    </div>
  );
};

export default MonacoEditor;
