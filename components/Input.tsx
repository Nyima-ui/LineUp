"use client";

/*
CODE NO LONGER IN USER
 */
import { useEffect, useRef, useState } from "react";
import { formatText, detectOpenBracket } from "@/app/editor/formatting";
import { Line } from "./types";
import {
  restoreCursorPosition,
  saveCursorPosition,
  setCursorPosition,
  getTextAroundCursor,
} from "@/app/editor/caret";

interface InputProps {
  lines: Line[];
  setLines: React.Dispatch<React.SetStateAction<Line[]>>;
  generateId: () => string;
  setActiveLine: React.Dispatch<React.SetStateAction<number>>;
}

const Input = ({ lines, setLines, generateId, setActiveLine }: InputProps) => {
  const lineRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const [focusId, setFocusId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);

  function autoCloseBracket(id: string, text: string) {
    const element = lineRefs.current.get(id);
    if (!element) return;

    const cursorPosition = saveCursorPosition(element);
    const newText = text + "]";

    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, text: newText } : line)),
    );
    const formattedHTML = formatText(newText);
    element.innerHTML = formattedHTML;

    if (cursorPosition !== null) {
      restoreCursorPosition(element, cursorPosition);
    }
  }

  function handleInputChange(id: string, e: React.FormEvent<HTMLSpanElement>) {
    const element = e.currentTarget;
    const cursorPosition = saveCursorPosition(element);
    const text = element.textContent || "";
    const previousText = lines.find((line) => line.id === id)?.text || "";

    const justTypedOpenBracket = detectOpenBracket(previousText, text);

    if (justTypedOpenBracket) {
      autoCloseBracket(id, text);
      return;
    }

    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, text } : line)),
    );

    const highLightedHTML = formatText(text);
    if (element.innerHTML !== highLightedHTML) {
      element.innerHTML = highLightedHTML;
      if (cursorPosition !== null)
        restoreCursorPosition(element, cursorPosition);
    }
  }

  function moveCursorToEnd(lineId: string) {
    const span = lineRefs.current.get(lineId);
    if (span) setCursorPosition(span, "end");
  }

  function navigateToLine(targetIndex: number) {
    if (targetIndex < 0 || targetIndex >= lines.length) return;

    const targetLineId = lines[targetIndex].id;
    const targetSpan = lineRefs.current.get(targetLineId);
    if (!targetSpan) return;

    requestAnimationFrame(() => {
      targetSpan.focus();
      moveCursorToEnd(targetLineId);
    });
  }

  function createNewLine(id: string, index: number, text: string = "") {
    const newLineId = generateId();

    setLines((prev) => {
      const next = [...prev];
      const newLine = { id: newLineId, text };
      next.splice(index + 1, 0, newLine);
      return next;
    });
    return newLineId;
  }

  function handleEnter(id: string) {
    const element = lineRefs.current.get(id);
    if (!element) return;

    const cursorPosition = saveCursorPosition(element);
    const totalTextLength = element.textContent?.length || 0;
    const index = lines.findIndex((line) => line.id === id);

    if (cursorPosition !== null && cursorPosition < totalTextLength) {
      const { left, right } = getTextAroundCursor(element);

      setLines((prev) =>
        prev.map((line) => (line.id === id ? { ...line, text: left } : line)),
      );
      element.innerHTML = formatText(left);

      const newLineId = createNewLine(id, index, right);
      setTimeout(() => {
        const newElement = lineRefs.current.get(newLineId);
        if (newElement) {
          newElement.innerHTML = formatText(right);
          newElement.focus();
          setCursorPosition(newElement, "start");
        }
      }, 0);
    } else {
      const newLineId = createNewLine(id, index);
      setFocusId(newLineId);
    }
  }

  function handleBackspace(id: string) {
    const element = lineRefs.current.get(id);
    if (!element) return;

    const index = lines.findIndex((line) => line.id === id);
    if (index <= 0) return;

    const cursorPosition = saveCursorPosition(element);
    if (cursorPosition !== 0) return;

    const currentText = lines[index].text;
    const previousLine = lines[index - 1];
    const previousElement = lineRefs.current.get(previousLine.id);
    if (!previousElement) return;

    const newCursorPosition = previousLine.text.length;
    const mergedText = previousLine.text + currentText;

    setLines((prev) =>
      prev
        .map((l) => (l.id === previousLine.id ? { ...l, text: mergedText } : l))
        .filter((l) => l.id !== id),
    );

    setTimeout(() => {
      previousElement.innerHTML = formatText(mergedText);
      previousElement.focus();
      restoreCursorPosition(previousElement, newCursorPosition);
    }, 0);
  }

  function handleKeyDown(id: string, e: React.KeyboardEvent<HTMLSpanElement>) {
    const currentIndex = lines.findIndex((l) => l.id === id);

    if (e.key === "Enter") {
      e.preventDefault();
      handleEnter(id);
      return;
    }
    if (e.key === "Backspace") {
      const element = lineRefs.current.get(id);
      const cursorPosition = element ? saveCursorPosition(element) : null;

      if (cursorPosition === 0 && currentIndex > 0) {
        e.preventDefault();
        handleBackspace(id);
        return;
      }
    }
    if (e.key === "ArrowUp" && currentIndex > 0) {
      e.preventDefault();
      navigateToLine(currentIndex - 1);
      return;
    }
    if (e.key === "ArrowDown" && currentIndex < lines.length - 1) {
      e.preventDefault();
      navigateToLine(currentIndex + 1);
      return;
    }
  }

  //populate innerHTML
  useEffect(() => {
    if (!initializedRef.current && lines.length > 0) {
      lines.forEach((line) => {
        const element = lineRefs.current.get(line.id);
        if (element && line.text) {
          element.innerHTML = formatText(line.text);
        }
      });
      initializedRef.current = true;
    }
  }, [lines]);

  //focuses span element
  useEffect(() => {
    const resetFocus = () => setFocusId(null);
    if (focusId !== null) {
      lineRefs.current.get(focusId)?.focus();
      resetFocus();
    }
  }, [focusId]);

  //handles outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Node;
      if (!containerRef.current) return;
      const clickedOnSpan = Array.from(lineRefs.current.values()).some((span) =>
        span.contains(target),
      );
      if (containerRef.current.contains(target) && !clickedOnSpan) {
        const lastLine = lines[lines.length - 1];
        if (!lastLine) return;

        const lastSpan = lineRefs.current.get(lastLine.id);
        if (!lastSpan) return;

        requestAnimationFrame(() => {
          lastSpan.focus();
          moveCursorToEnd(lastLine.id);
        });
      }
    }

    if (containerRef.current)
      document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [lines]);

  return (
    <div className="pl-1 min-h-screen pb-20 flex-1" ref={containerRef}>
      {lines.map((line, idx) => (
        <div key={line.id}>
          <span
            ref={(el) => {
              if (el) lineRefs.current.set(line.id, el);
              else lineRefs.current.delete(line.id);
            }}
            id={line.id}
            contentEditable
            suppressContentEditableWarning
            spellCheck="false"
            onInput={(e) => handleInputChange(line.id, e)}
            onKeyDown={(e) => handleKeyDown(line.id, e)}
            onFocus={() => setActiveLine(idx)}
            className="inline-block h-4.75 w-full outline-white/20 focus:outline-2"
          ></span>
        </div>
      ))}
    </div>
  );
};

export default Input;
