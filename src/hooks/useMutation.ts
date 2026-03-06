// hooks/useMutation.ts
import { useState, useCallback } from "react";

export interface UseMutationOptions<P = any, R = any, D = any> {
    /** 实际执行请求的函数 */
    fetcher: (params?: P) => Promise<R>;
    /** 成功时回调 */
    onSuccess?: (data: D, response: R) => void;
    /** 失败时回调 */
    onError?: (error: any) => void;
    /** 无论成功失败都会执行 */
    onFinally?: () => void;
    /** 是否在 loading 时阻止重复提交 */
    preventDuplicate?: boolean;
}

export interface UseMutationResult<P = any, R = any, D = any> {
    /** 提取后的响应数据（如 response.data） */
    data: D | null;
    /** 完整响应对象 */
    res: R | null;
    /** 错误对象 */
    error: any;
    /** 请求中标识 */
    loading: boolean;
    /** 执行 mutation */
    mutate: (params?: P) => Promise<void>;
    /** 重置状态 */
    reset: () => void;
}

export function useMutation<P = any, R = any, D = any>({
    fetcher,
    onSuccess,
    onError,
    onFinally,
    preventDuplicate = true,
}: UseMutationOptions<P, R, D>): UseMutationResult<P, R, D> {
    const [data, setData] = useState<D | null>(null);
    const [res, setRes] = useState<R | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const mutate = useCallback(
        async (params?: P) => {
            if (loading && preventDuplicate) return; // 防止重复提交

            setLoading(true);
            setError(null);

            try {
                const response: any = await fetcher(params);
                setRes(response);
                // @ts-ignore 自动提取 data 字段
                const extracted = (response as any)?.data ?? response;
                setData(extracted);
                if (response?.code ===200) {
                    onSuccess?.(extracted, response);
                } else {
                    onError?.(response);
                }

            } catch (err) {
                setError(err);
                onError?.(err);
            } finally {
                setLoading(false);
                onFinally?.();
            }
        },
        [fetcher, onSuccess, onError, onFinally, loading, preventDuplicate]
    );

    const reset = useCallback(() => {
        setData(null);
        setRes(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, res, error, loading, mutate, reset };
}
