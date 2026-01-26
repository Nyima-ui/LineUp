export function formatText(text: string): string {
  const match = text.match(/^(\d+\.\s+)?(\[([^\]]*)\])?(.*)$/);
  if (!match) return text;

  const [, number, bracket, bracketContent, rest] = match;
  let html = "";

  if (number) {
    html += `<span class="text-editor-list-marker">${number.replace(/\s/, "&nbsp;")}</span>`;
  }
  if (bracket) {
    html += `<span>[<span class="text-orange-300 font-serif font-extralight">${bracketContent}</span>]</span>`;
  }
  if (rest) {
    html += `<span>${rest}</span>`;
  }
  return html || text;
}

export function detectOpenBracket(previousText: string, currentText: string) {
  return (
    currentText.length === previousText.length + 1 &&
    currentText.endsWith("[") &&
    !previousText.endsWith("[")
  );
}
