"use client";

import { useRouter } from "next/navigation";
import { useRef, useCallback } from "react";

export default function ClubShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const touchX = useRef(0);
  const touchY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    touchY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    const dy = e.changedTouches[0].clientY - touchY.current;
    if (Math.abs(dx) > 60 && Math.abs(dy) < Math.abs(dx) * 0.6) {
      router.push("/club");
    }
  }, [router]);

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {children}
    </div>
  );
}
