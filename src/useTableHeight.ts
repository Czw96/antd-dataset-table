import { useEffect, useRef, useState } from "react";

interface UseTableHeightOptions {
  headerHeight: number; // 表头高度(含 padding/margin)
  footerHeight: number; // 分页/操作栏高度
}

/**
 * 自动计算表格可用高度(用于 scroll.y)
 * @param containerRef - 表格容器的 ref
 * @param options - 配置项
 * @returns 可用高度(px)
 */
export function useTableHeight(containerRef: React.RefObject<HTMLDivElement | null>, options: UseTableHeightOptions) {
  const { headerHeight, footerHeight } = options;
  const [availableHeight, setAvailableHeight] = useState<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculateHeight = () => {
      // 使用 requestAnimationFrame 确保浏览器完成布局计算
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const containerHeight = container.getBoundingClientRect().height;
        const totalUsedHeight = headerHeight + footerHeight;
        const height = containerHeight - totalUsedHeight;
        setAvailableHeight(height > 0 ? height : 0);
      });
    };

    // 初始计算
    calculateHeight();

    // 监听窗口大小变化
    window.addEventListener("resize", calculateHeight);

    // 使用 ResizeObserver 监听容器变化(带防抖)
    let resizeObserver: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        // 将计算对齐浏览器渲染帧, 避免重复计算
        calculateHeight();
      });
      resizeObserver.observe(container);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("resize", calculateHeight);
      resizeObserver?.disconnect();
    };
  }, [containerRef, headerHeight, footerHeight]);

  return availableHeight;
}
