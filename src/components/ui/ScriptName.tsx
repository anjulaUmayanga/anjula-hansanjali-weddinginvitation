"use client";

import { titleCaseName } from "@/lib/text";

type ScriptNameProps = {
  children: string;
  className?: string;
};

/**
 * Renders a name in script with an emphasized capital on each word
 * so first letters never look like lowercase.
 */
export function ScriptName({ children, className = "" }: ScriptNameProps) {
  const text = titleCaseName(children);

  return (
    <span className={`font-script italic leading-none tracking-wide ${className}`}>
      {text.split(/(\s+|&)/).map((part, i) => {
        if (!part || /^\s+$/.test(part)) {
          return <span key={i}>{part}</span>;
        }
        if (part === "&") {
          return (
            <span key={i} className="mx-[0.12em] inline-block font-serif not-italic text-[0.55em] opacity-80">
              &
            </span>
          );
        }
        const first = part.charAt(0);
        const rest = part.slice(1);
        return (
          <span key={i} className="inline-block whitespace-nowrap">
            <span className="script-initial">{first}</span>
            <span>{rest}</span>
          </span>
        );
      })}
    </span>
  );
}
