"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// crossfading background photos
export function HeroSlideshow({ images, interval = 6000 }: { images: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  return images.map((src, i) => (
    <Image
      key={src}
      src={src}
      alt=""
      fill
      priority={i === 0}
      sizes="100vw"
      className={`object-cover transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
    />
  ));
}
