import { useEffect, useRef, useState } from "react";

interface UseTableHeightOptions {
  size?: "small" | "middle" | "medium" | "large";
}

const DEFAULT_HEIGHTS: Record<string, { headerHeight: number; footerHeight: number }> = {
  small: { headerHeight: 39, footerHeight: 56 },
  middle: { headerHeight: 47, footerHeight: 56 },
  large: { headerHeight: 55, footerHeight: 56 },
};

/**
 * 自动计算表格可用高度(用于 scroll.y)。
 * 首次用估算值避免闪烁, 后续从 DOM 实测 thead / footer 真实高度,
 * 自定义主题或 antd 版本升级时自动适配。
 */
export function useTableHeight(containerRef: React.RefObject<HTMLDivElement | null>, options: UseTableHeightOptions = {}) {
  const { size = "middle" } = options;
  const fallback = DEFAULT_HEIGHTS[size] || DEFAULT_HEIGHTS.middle;
  const [availableHeight, setAvailableHeight] = useState<number>(0);
  const rafRef = useRef<number>(0);
  const isFirstRef = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    if (!container) return;

    // 从 DOM 实测表头和页脚高度, 取不到则用估算值兜底
    const getUsedHeight = (): number => {
      const thead = container.querySelector(".ant-table-thead") as HTMLElement | null;
      const footer = container.querySelector(".ant-table-footer") as HTMLElement | null;
      const realHeader = thead ? thead.getBoundingClientRect().height : fallback.headerHeight;
      const realFooter = footer ? footer.getBoundingClientRect().height : fallback.footerHeight;
      return realHeader + realFooter;
    };

    const calculateHeight = () => {
      if (isFirstRef.current) {
        isFirstRef.current = false;
        const containerHeight = container.getBoundingClientRect().height;
        const height = containerHeight - getUsedHeight();
        setAvailableHeight(height > 0 ? height : 0);
        return;
      }

      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const containerHeight = container.getBoundingClientRect().height;
        const height = containerHeight - getUsedHeight();
        setAvailableHeight(height > 0 ? height : 0);
      });
    };

    calculateHeight();

    window.addEventListener("resize", calculateHeight);

    let resizeObserver: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        calculateHeight();
      });
      resizeObserver.observe(container);
    }

    return () => {
      window.removeEventListener("resize", calculateHeight);
      resizeObserver?.disconnect();
    };
  }, [containerRef, fallback.headerHeight, fallback.footerHeight]);

  return availableHeight;
}
