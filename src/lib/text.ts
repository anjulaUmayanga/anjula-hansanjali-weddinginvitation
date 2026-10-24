/** Title-case each word: "anjula & hansanjali" → "Anjula & Hansanjali" */
export function titleCaseName(value: string): string {
  return value
    .trim()
    .split(/(\s+|&)/)
    .map((part) => {
      if (!part || /^\s+$/.test(part) || part === "&") return part;
      const lower = part.toLocaleLowerCase("en");
      return lower.charAt(0).toLocaleUpperCase("en") + lower.slice(1);
    })
    .join("");
}
