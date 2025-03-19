"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      setStart(true);
    }
  }

  const speedMap = {
    fast: "animate-scroll-infinite-20",
    normal: "animate-scroll-infinite-25",
    slow: "animate-scroll-infinite-30",
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && speedMap[speed],
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[350px] max-w-full relative rounded-2xl border border-white/10 flex-shrink-0 px-8 py-6 bg-gradient-to-br from-white/10 to-white/5"
            key={idx}
          >
            <blockquote>
              <p className="text-sm leading-[1.6] text-gray-300">
                {item.quote}
              </p>
              <footer className="mt-4">
                <p className="text-base font-semibold text-white">{item.name}</p>
                <p className="text-sm text-gray-400">{item.title}</p>
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}; 