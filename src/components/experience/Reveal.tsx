"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cssVars } from "@/lib/css-vars";
import { useExperience } from "./ExperienceProvider";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Độ trễ (ms) để tạo hiệu ứng xuất hiện lần lượt */
  delay?: number;
}

/** Hiện nội dung với fade + translate nhẹ khi cuộn tới. Chỉ bắt đầu quan sát sau khi thiệp đã mở. */
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { isRevealed } = useExperience();

  useEffect(() => {
    const element = ref.current;
    if (!element || !isRevealed || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [isRevealed, visible]);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={cssVars({ "--reveal-delay": `${delay}ms` })}
    >
      {children}
    </div>
  );
}
