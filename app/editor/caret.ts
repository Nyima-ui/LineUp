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
