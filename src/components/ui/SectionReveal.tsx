"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
};

export function SectionReveal({
  children,
  className = "",
  id,
  as = "section",
}: SectionRevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      id={id}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 36, filter: "blur(8px)" }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
