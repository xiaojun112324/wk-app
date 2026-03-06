import { useEffect, useRef } from 'react';
import { useActivate, useUnactivate } from 'react-activation';

interface UsePollingOptions {
    delay?: number;
    enabled?: boolean;
    immediateOnActivate?: boolean;
}

export function usePolling(
    fn: (signal?: AbortSignal) => void | Promise<void>,
    options?: UsePollingOptions
) {
    const {
        delay = 5000,
        enabled = true,
        immediateOnActivate = true,
    } = options || {};

    const timerRef = useRef<number | null>(null);
    const fnRef = useRef(fn);
    const enabledRef = useRef(enabled);
    const pollingRef = useRef(false);
    const activeRef = useRef(false);

    const abortRef = useRef<AbortController | null>(null);

    fnRef.current = fn;
    enabledRef.current = enabled;

    const clearTimer = () => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const stopRequest = () => {
        abortRef.current?.abort();
        abortRef.current = null;
    };

    const poll = async () => {
        console.log('[usePolling] poll');

        if (
            pollingRef.current ||
            !enabledRef.current ||
            !activeRef.current
        ) {
            return;
        }

        pollingRef.current = true;
        abortRef.current = new AbortController();

        try {
            await Promise.resolve(
                fnRef.current(abortRef.current.signal)
            );
        } catch (e: any) {
            if (e?.name !== 'AbortError') {
                console.error('[usePolling]', e);
            }
        } finally {
            pollingRef.current = false;
            abortRef.current = null;
        }

        if (!enabledRef.current || !activeRef.current) return;

        timerRef.current = window.setTimeout(poll, delay);
    };

    /**
     * ✅ 首次 mount（无 KeepAlive 也能跑）
     */
    useEffect(() => {
        activeRef.current = true;

        if (!enabledRef.current) return;

        if (immediateOnActivate) {
            poll();
        } else {
            timerRef.current = window.setTimeout(poll, delay);
        }

        return () => {
            activeRef.current = false;
            clearTimer();
            stopRequest();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * ✅ KeepAlive 恢复
     */
    useActivate(() => {
        activeRef.current = true;
        clearTimer();

        if (!enabledRef.current) return;

        if (immediateOnActivate) {
            poll();
        } else {
            timerRef.current = window.setTimeout(poll, delay);
        }
    });

    /**
     * ✅ KeepAlive 缓存
     */
    useUnactivate(() => {
        activeRef.current = false;
        clearTimer();
        stopRequest();
    });

    /**
     * ✅ enabled 动态开关
     */
    useEffect(() => {
        if (!enabled) {
            clearTimer();
            stopRequest();
            return;
        }

        if (activeRef.current && !pollingRef.current) {
            poll();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);
}
