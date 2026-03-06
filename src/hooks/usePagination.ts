// hooks/usePaginatedQuery.ts
import { useState, useEffect, useRef, useCallback } from "react";

export interface UsePaginatedQueryOptions<P = any, R = any> {
    fetcher: (params: P & { page?: number; pageSize?: number }) => Promise<R>;
    params?: P;
    deps?: any[];
    immediate?: boolean;
    pageSize?: number;
    incremental?: boolean; // ✅ 新增
    isRestData?: boolean;
}

export interface UsePaginatedQueryResult<P = any, R = any> {
    data: any[];
    res: R | null;
    total: number;
    page: number;
    pageSize: number;
    isLastPage: boolean;
    hasMore: boolean;
    isEmpty: boolean;
    loading: boolean;
    initLoading: boolean;
    error: any;
    run: (options?: {
        newParams?: P;
        newPagination?: { page?: number; pageSize?: number };
        overrideFetcher?: (params: any) => Promise<R>;
    }) => void;
    refresh: () => void;
    setParams: (params: P) => void;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    setData: (data: any) => void;
}

export function usePaginatedQuery<P = any, R = any>({
    fetcher,
    params,
    deps = [],
    immediate = true,
    pageSize: defaultPageSize = 20,
    incremental = false, // ✅ 默认关闭
    isRestData = true
}: UsePaginatedQueryOptions<P, R>): UsePaginatedQueryResult<P, R> {
    const [data, setData] = useState<any[]>([]);
    const [res, setRes] = useState<R | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPageState] = useState(1);
    const [pageSize, setPageSizeState] = useState(defaultPageSize);
    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const paramsRef = useRef<P | undefined>(params);
    const pageRef = useRef(1);
    const pageSizeRef = useRef(defaultPageSize);

    /** 当前全局生效的 fetcher（支持 overrideFetcher 持久化） */
    const fetcherRef = useRef(fetcher);

    useEffect(() => {
        fetcherRef.current = fetcher;
    }, [fetcher]);

    const run = useCallback(
        async ({
            newParams,
            newPagination,
            overrideFetcher,
        }: {
            newParams?: P;
            newPagination?: { page?: number; pageSize?: number };
            overrideFetcher?: (params: any) => Promise<R>;
        } = {}) => {
            if (overrideFetcher) {
                fetcherRef.current = overrideFetcher;
            }

            const effectiveFetcher = fetcherRef.current;
            const effectiveParams = newParams ?? paramsRef.current;
            const currentPage = newPagination?.page ?? pageRef.current;
            const currentPageSize = newPagination?.pageSize ?? pageSizeRef.current;

            paramsRef.current = effectiveParams;
            pageRef.current = currentPage;
            pageSizeRef.current = currentPageSize;

            setPageState(currentPage);
            setPageSizeState(currentPageSize);
            if (currentPage === 1) {
                setInitLoading(true);
            }
            setLoading(true);
            setError(null);
            if (currentPage == 1 && isRestData) {
                setData([])
            }


            try {
                const reqParams: any = {
                    ...(effectiveParams as object),
                    pageNum: currentPage,
                    pageSize: currentPageSize,
                };

                const result: any = await effectiveFetcher(reqParams);
                setRes(result);

                const records =
                    result?.records ||
                    result?.data?.records ||
                    result?.dataList ||
                    result?.data?.list ||
                    [];

                const totalCount =
                    result?.total ??
                    result?.data?.total ??
                    records.length;

                setTotal(totalCount);

                /** ✅ 核心：是否增量 */
                setData((prev) => {
                    if (!incremental) return records;

                    // page = 1 / 参数变化 / pageSize 变化 → 重置
                    if (currentPage === 1) {
                        return records;
                    }

                    return [...prev, ...records];
                });
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
                setInitLoading(false);
            }
        },
        [incremental]
    );

    const refresh = useCallback(() => {
        run({
            newParams: paramsRef.current,
            newPagination: {
                page: pageRef.current,
                pageSize: pageSizeRef.current,
            },
        });
    }, [run]);

    const setParams = useCallback(
        (newParams: P) => {
            paramsRef.current = newParams;
            run({
                newParams,
                newPagination: {
                    page: 1,
                    pageSize: pageSizeRef.current,
                },
            });
        },
        [run]
    );

    const setPage = useCallback(
        (p: number) => {
            if (p !== pageRef.current) {
                run({
                    newPagination: {
                        page: p,
                        pageSize: pageSizeRef.current,
                    },
                });
            }
        },
        [run]
    );

    const setPageSize = useCallback(
        (ps: number) => {
            if (ps !== pageSizeRef.current) {
                run({
                    newPagination: {
                        page: 1,
                        pageSize: ps,
                    },
                });
            }
        },
        [run]
    );

    useEffect(() => {
        if (immediate) {
            run({
                newParams: paramsRef.current,
                newPagination: {
                    page: pageRef.current,
                    pageSize: pageSizeRef.current,
                },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, JSON.stringify(params)]);

    /** 派生状态 */
    const isLastPage = total <= 0 || page * pageSize >= total;
    const isEmpty = (page == 1 && total <= 0);

    return {
        data,
        res,
        total,
        page,
        initLoading,
        pageSize,
        isLastPage,
        hasMore: !isLastPage,
        loading,
        isEmpty,
        error,
        run,
        refresh,
        setParams,
        setPage,
        setPageSize,
        setData,
    };
}
