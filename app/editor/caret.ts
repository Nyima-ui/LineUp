/*
 BELOW CODE IS NOT BEING USED IN THE APPLICATION. 
 BUT I DON'T WANT TO DELETE THE FOLDER BECAUSE I SPENT SO MUCH TIME TRYING TO UNDERSTAND IT
 */

export function restoreCursorPosition(element: HTMLElement, position: number) {
  const selection = window.getSelection();
  if (!selection) return;

  let offset = 0;
  const stack: Node[] = [element];

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (node.nodeType === Node.TEXT_NODE) {
      const textLength = node.textContent?.length ?? 0;

      if (position <= offset + textLength) {
        const range = document.createRange();
        range.setStart(node, position - offset);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }

      offset += textLength;
    } else {
      // Push children in reverse because we are using .pop()
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        stack.push(node.childNodes[i]);
      }
    }
  }
}

export function saveCursorPosition(element: HTMLElement) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(element);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);

  return preSelectionRange.toString().length;
}

export function setCursorPosition(
  element: HTMLElement,
  position: "start" | "end",
) {
  const range = document.createRange();
  const selection = window.getSelection();
  if (!selection) return;

  if (position === "end") {
    range.selectNodeContents(element);
    range.collapse(false);
  } else {
    range.setStart(element, 0);
    range.collapse(true);
  }
  selection.removeAllRanges();
  selection.addRange(range);
}

export function getTextAroundCursor(element: HTMLElement) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return { left: "", right: "" };
  }
  const range = selection.getRangeAt(0);

  const rangeToStart = document.createRange();
  rangeToStart.setStart(element, 0);
  rangeToStart.setEnd(range.startContainer, range.startOffset);

  const rangeToEnd = document.createRange();
  rangeToEnd.setStart(range.startContainer, range.startOffset);
  rangeToEnd.setEnd(element, element.childNodes.length);

  return {
    left: rangeToStart.toString(),
    right: rangeToEnd.toString(),
  };
}
