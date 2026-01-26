export function formatText(text: string): string {
  if (/^#+/.test(text)) {
    return `<span class="text-heading font-semibold">${text}</span>`;
  }
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
  const prevNormalized = previousText.replace(/[\u00A0\s]/g, " ");
  const currNormalized = currentText.replace(/[\u00A0\s]/g, " ");

  return (
    currNormalized.length === prevNormalized.length + 1 &&
    currNormalized.endsWith("[") &&
    !prevNormalized.endsWith("[")
  );
}

export function formatHeading(text: string): string {
  const match = text.match(/(\#)(.*)$/);
  if (!match) return text;
  let html = "";
  const [heading] = match;
  if (heading) {
    html += `<span>${heading}</span>`;
  }
  return html || text;
}
