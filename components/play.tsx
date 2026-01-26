"use client";
import { useEffect, useRef, useState } from "react";
import { restoreCursorPosition, saveCursorPosition } from "@/app/editor/caret";
import { formatText, detectOpenBracket } from "@/app/editor/formatting";
import { Line } from "./types";

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
    if (!span) return;

    const range = document.createRange();
    const selection = window.getSelection();
    if (!selection) return;

    range.selectNodeContents(span);
    range.collapse(false);
    selection?.removeAllRanges();
    selection.addRange(range);
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

  function getTextOnLeft(element: HTMLSpanElement) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
      return element.textContent || "";

    const range = selection.getRangeAt(0);
    const rangeFromStart = document.createRange();
    rangeFromStart.setStart(element, 0);
    rangeFromStart.setEnd(range.startContainer, range.startOffset);

    return rangeFromStart.toString();
  }

  function getTextOnRight(element: HTMLSpanElement) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return "";

    const range = selection.getRangeAt(0);
    console.log(range);
    const rangeToEnd = document.createRange();
    rangeToEnd.setStart(range.startContainer, range.startOffset);
    rangeToEnd.setEnd(element, element.childNodes.length);
    console.log(rangeToEnd.toString());
    return rangeToEnd.toString();
  }

  function handleEnterWhenTextOnRight(id: string, textOnRight: string) {
    const currentElement = lineRefs.current.get(id);
    if (!currentElement) return;

    const textOnLeft = getTextOnLeft(currentElement);
    const newLineId = generateId();

    setLines((lines) => {
      const index = lines.findIndex((l) => l.id === id);
      const next = [...lines];
      next[index] = { ...next[index], text: textOnLeft };
      const newLine = { id: newLineId, text: textOnRight };
      next.splice(index + 1, 0, newLine);
      return next;
    });

    currentElement.innerHTML = formatText(textOnLeft);

    setTimeout(() => {
      const newElement = lineRefs.current.get(newLineId);
      if (newElement) {
        newElement.innerHTML = formatText(textOnRight);
        newElement.focus();

        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(newElement, 0);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 0);
  }

  function detectTextOnRight(id: string) {
    const element = lineRefs.current.get(id);
    if (!element) return false;

    const cursorPosition = saveCursorPosition(element);
    const totalTextLength = element.textContent?.length || 0;

    if (cursorPosition === null || cursorPosition >= totalTextLength)
      return false;
    else {
      const textOnRight = getTextOnRight(element);
      handleEnterWhenTextOnRight(id, textOnRight);
      return true;
    }
  }

  function handleEnter(id: string) {
    const newLineId = generateId();
    const isThereTextOnRight = detectTextOnRight(id);
    console.log(isThereTextOnRight);
    if (isThereTextOnRight) return;
    setLines((prev) => {
      const index = prev.findIndex((line) => line.id === id);
      const next = [...prev];
      const newLine = { id: newLineId, text: "" };
      next.splice(index + 1, 0, newLine);
      return next;
    });
    setFocusId(newLineId);
  }

  function handleBackspace(id: string) {
    const index = lines.findIndex((line) => line.id === id);
    if (index <= 0 || lines.length <= 1) return;
    const previousLineId = lines[index - 1].id;

    setLines((prev) => prev.filter((line) => line.id !== id));
    setFocusId(previousLineId);

    setTimeout(() => {
      moveCursorToEnd(previousLineId);
    }, 0);
  }

  function handleKeyDown(id: string, e: React.KeyboardEvent<HTMLSpanElement>) {
    const currentIndex = lines.findIndex((l) => l.id === id);
    const currentText = lines[currentIndex]?.text || "";

    if (e.key === "Enter") {
      e.preventDefault();
      handleEnter(id);
      return;
    }
    if (e.key === "Backspace" && currentText === "" && currentIndex > 0) {
      e.preventDefault();
      handleBackspace(id);
      return;
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

  useEffect(() => {
    // console.log(lines);
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
