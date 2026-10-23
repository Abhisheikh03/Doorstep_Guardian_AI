"use client";

import { useEffect, useState, useCallback } from "react";

interface UseFocusNavigationOptions {
  itemCount: number;
  initialIndex?: number;
  onSelect?: (index: number) => void;
  onBack?: () => void;
  orientation?: "vertical" | "horizontal" | "grid";
  columns?: number;
  enabled?: boolean;
}

export function useFocusNavigation({
  itemCount,
  initialIndex = 0,
  onSelect,
  onBack,
  orientation = "vertical",
  columns = 1,
  enabled = true,
}: UseFocusNavigationOptions) {
  const [focusedIndex, setFocusedIndex] = useState<number>(initialIndex);

  // Sync index if itemCount changes
  useEffect(() => {
    if (focusedIndex >= itemCount && itemCount > 0) {
      setFocusedIndex(itemCount - 1);
    }
  }, [itemCount, focusedIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled || itemCount === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (orientation === "vertical" || orientation === "grid") {
            setFocusedIndex((prev) => {
              const next = orientation === "grid" ? prev + columns : prev + 1;
              return next < itemCount ? next : prev;
            });
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (orientation === "vertical" || orientation === "grid") {
            setFocusedIndex((prev) => {
              const next = orientation === "grid" ? prev - columns : prev - 1;
              return next >= 0 ? next : prev;
            });
          }
          break;

        case "ArrowRight":
          e.preventDefault();
          if (orientation === "horizontal" || orientation === "grid") {
            setFocusedIndex((prev) => (prev + 1 < itemCount ? prev + 1 : prev));
          }
          break;

        case "ArrowLeft":
          e.preventDefault();
          if (orientation === "horizontal" || orientation === "grid") {
            setFocusedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
          }
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          if (onSelect) {
            onSelect(focusedIndex);
          }
          break;

        case "Backspace":
        case "Escape":
          e.preventDefault();
          if (onBack) {
            onBack();
          }
          break;
      }
    },
    [enabled, itemCount, orientation, columns, focusedIndex, onSelect, onBack]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    focusedIndex,
    setFocusedIndex,
    isFocused: (index: number) => focusedIndex === index,
  };
}
