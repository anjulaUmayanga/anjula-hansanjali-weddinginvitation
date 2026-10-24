"use client";

import Image from "next/image";
import { useState } from "react";

const GRADIENTS = [
  "from-[#C9D3C0] via-[#F1E4CF] to-[#F3DCD8]",
  "from-[#F3DCD8] via-[#FBF7F0] to-[#E6C987]",
  "from-[#9FB097] via-[#F1E4CF] to-[#F3DCD8]",
  "from-[#E6C987] via-[#C9D3C0] to-[#FBF7F0]",
];

type PhotoFrameProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  index?: number;
};

export function PhotoFrame({
  src,
  alt,
  className = "",
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
  fill = true,
  width,
  height,
  index = 0,
}: PhotoFrameProps) {
  const [failed, setFailed] = useState(false);
  const gradient = GRADIENTS[index % GRADIENTS.length];

  if (failed) {
    return (
      <div
        className={`bg-gradient-to-br ${gradient} ${className}`}
        role="img"
        aria-label={alt}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${className}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 1000}
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
