// hooks/useQuery.ts
import { useState, useEffect, useRef, useCallback } from "react";

export interface UseQueryOptions<P = any, R = any> {
  fetcher: (params?: P) => Promise<R>;
  deps?: any[];
  params?: P;
  immediate?: boolean;
}

export interface UseQueryResult<P = any, R = any, D = any> {
  data: D | null;
  res: R | null;
  loading: boolean;       // 后台刷新，每次 run/refresh 都触发
  initLoading: boolean;   // 首屏请求，仅首次为 true
  error: any;
  run: (newParams?: P) => Promise<D | null>;
  refresh: () => Promise<D | null>;
}

export function useQuery<P = any, R = any, D = any>({
  fetcher,
  deps = [],
  params,
  immediate = true,
}: UseQueryOptions<P, R>): UseQueryResult<P, R, D> {
  const [data, setData] = useState<D | null>(null);
  const [res, setRes] = useState<R | null>(null);

  const [loading, setLoading] = useState(false);     // 后台刷新
  const [initLoading, setInitLoading] = useState(true); // 首屏加载

  const [error, setError] = useState<any>(null);
  const paramsRef = useRef<P | undefined>(params);
  const isInitRef = useRef(true); // 标记首屏请求

  const run = useCallback(
    async (newParams?: P): Promise<D | null> => {
      const effectiveParams = newParams ?? paramsRef.current;
      paramsRef.current = effectiveParams;

      // 后台刷新 loading 每次触发
      setLoading(true);
      setError(null);

      // 首屏请求
      if (isInitRef.current) {
        setInitLoading(true);
      }

      try {
        const response: any = await fetcher(effectiveParams);
        setRes(response);

        if (response.code == 200) {
          const extractedData = (response as any)?.data ?? response;
          setData(extractedData);
          return extractedData;
        } else {
          setData(null);
          return null;
        }
      } catch (err) {
        setError(err);
        return null;
      } finally {
        setLoading(false);

        // 首屏请求结束
        if (isInitRef.current) {
          setInitLoading(false);
          isInitRef.current = false;
        }
      }
    },
    [fetcher]
  );

  const refresh = useCallback(async (): Promise<D | null> => {
    return run();
  }, [run]);

  useEffect(() => {
    if (!immediate) return;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, initLoading, error, run, refresh, res };
}
