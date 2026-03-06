import { useEffect, useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";
import Loading from "./Loading";
import clsx from "clsx";
import { Empty } from "antd";

/**
 * 企业级 InfiniteScroll 组件
 * 特性：
 * - 支持外部受控 / 内部非受控 loading
 * - loadMore 支持同步函数（不要求 Promise）
 * - IntersectionObserver 触底加载
 * - 下拉刷新（移动端 + 桌面）
 * - Skeleton / 错误重试 / 空状态 / 结束提示
 */

interface InfiniteScrollProps {
  loadMore: () => void;              // 不要求 Promise
  refresh?: () => Promise<void>;
  hasMore: boolean;

  loading?: boolean;                 // 外部可控 loading
  initLoading?: boolean;

  loader?: ReactNode;
  skeleton?: ReactNode;
  error?: boolean;
  onRetry?: () => void;
  empty?: boolean;
  emptyNode?: ReactNode;
  noMoreText?: string;
  root?: HTMLElement | null;
  threshold?: number;
  children: ReactNode;
}

export default function InfiniteScroll({
  loadMore,
  refresh,
  hasMore,
  loading: loadingProp,
  initLoading = false,
  loader,
  skeleton,
  error,
  onRetry,
  empty = false,
  emptyNode,
  noMoreText = "已经到底啦",
  root = null,
  threshold = 0.1,
  children,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pullStartY = useRef<number | null>(null);
  const pullingRef = useRef(false);

  /** 内部 loading（非受控兜底） */
  const [innerLoading, setInnerLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isControlled = loadingProp !== undefined;
  const loading = isControlled ? loadingProp : innerLoading;

  /** 触底加载（IntersectionObserver） */
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (loading) return;

        if (!isControlled) {
          setInnerLoading(true);
        }

        loadMore();
      },
      { root, threshold }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore, root, threshold, isControlled]);

  /** 外部 loading 结束时，释放内部 loading */
  useEffect(() => {
    if (isControlled) return;
    if (!loading) {
      setInnerLoading(false);
    }
  }, [loading, isControlled]);

  /** 下拉刷新（Touch） */
  const handleTouchStart = (e: Event) => {
    if (!(e instanceof TouchEvent)) return;
    if (refreshing || !refresh) return;
    pullStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: Event) => {
    if (!(e instanceof TouchEvent)) return;
    if (!pullStartY.current) return;

    const diff = e.touches[0].clientY - pullStartY.current;
    if (diff > 65) {
      pullingRef.current = true;
    }
  };

  const handleTouchEnd = async () => {
    if (pullingRef.current && refresh) {
      setRefreshing(true);
      try {
        await refresh();
      } finally {
        setRefreshing(false);
      }
    }

    pullStartY.current = null;
    pullingRef.current = false;
  };

  useEffect(() => {
    const rootEl: any = root || document;

    rootEl.addEventListener("touchstart", handleTouchStart, { passive: true });
    rootEl.addEventListener("touchmove", handleTouchMove, { passive: true });
    rootEl.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      rootEl.removeEventListener("touchstart", handleTouchStart);
      rootEl.removeEventListener("touchmove", handleTouchMove);
      rootEl.removeEventListener("touchend", handleTouchEnd);
    };
  }, [refresh, refreshing, root]);

  /** 渲染 */
  if (empty && !loading && !initLoading) {
    return (
      emptyNode || (
        <div className="py-10 text-center text-gray-400 text-sm">
          <Empty description={'暂无数据'} />
        </div>
      )
    )

  }
  return (
    <div className="w-full h-full select-none">
      {initLoading && skeleton}



      {children}

      {refreshing && (
        <motion.div
          className="py-3 text-center text-sm text-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          刷新中…
        </motion.div>
      )}

      {error && (
        <div className="py-4 text-center text-red-500 text-sm">
          加载失败
          {onRetry ? <button
            className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
            onClick={onRetry}
          >
            重试
          </button> : ''}

        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-6 w-full" />}

      {loading &&
        (loader || (
          <>  <div className={clsx('py-4 text-center text-gray-500 text-sm flex items-center gap-2 justify-center', initLoading ? 'h-[50vh]' : '')}>
            <Loading loading={loading} />
          </div></>
        ))}

      {!hasMore && !loading && !error && (
        <motion.div
          className="py-4 text-center text-gray-400 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {noMoreText}
        </motion.div>
      )}
    </div>
  );
}
