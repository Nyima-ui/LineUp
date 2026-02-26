export function formatText(text: string): string {
  if (/^#+/.test(text)) {
    return `<span class="text-outline font-semibold">${text}</span>`;
  }
  const match = text.match(/^(\d+\.\s+)?(\[([^\]]*)\])?(.*)$/);
  if (!match) return text;

  const [, number, bracket, bracketContent, rest] = match;
  let html = "";

  if (number) {
    html += `<span class="text-outline">${number.replace(/\s/, "&nbsp;")}</span>`;
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
