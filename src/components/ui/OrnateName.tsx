"use client";

import { ScriptName } from "@/components/ui/ScriptName";
import { titleCaseName } from "@/lib/text";

type OrnateNameProps = {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClass = {
  sm: "text-2xl sm:text-3xl",
  md: "text-3xl sm:text-4xl",
  lg: "text-4xl sm:text-5xl",
  xl: "text-[clamp(2.75rem,12vw,5.5rem)]",
};

/** Cursive name with vine flourishes and clear capital initials */
export function OrnateName({
  children,
  className = "",
  as: Tag = "p",
  size = "md",
}: OrnateNameProps) {
  const text = titleCaseName(children);

  return (
    <Tag
      className={`ornate-name relative inline-flex flex-col items-center ${sizeClass[size]} ${className}`}
    >
      <svg
        className="ornate-flourish mb-1 h-4 w-40 text-maroon-soft sm:h-5 sm:w-56"
        viewBox="0 0 200 20"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 12c28-10 48-10 76 0 28 10 48 10 76 0 14-5 28-5 40 0"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M70 12c4-6 10-8 14-2 3 5 8 4 12-1"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.7"
        />
        <circle cx="100" cy="11" r="1.6" fill="currentColor" opacity="0.8" />
      </svg>

      <ScriptName className="ornate-script text-ink">{text}</ScriptName>

      <svg
        className="ornate-flourish mt-1 h-4 w-40 rotate-180 text-maroon-soft sm:h-5 sm:w-56"
        viewBox="0 0 200 20"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 12c28-10 48-10 76 0 28 10 48 10 76 0 14-5 28-5 40 0"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle cx="100" cy="11" r="1.6" fill="currentColor" opacity="0.8" />
      </svg>
    </Tag>
  );
}
