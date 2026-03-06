// src/hooks/useRefreshOnLanguageChange.ts
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageProvider';

/**
 * 在用户主动切换语言时执行回调
 * @param callback 切换语言时执行的函数
 */
export function useRefreshOnLanguageChange(callback: () => void) {
  const { subscribe } = useLanguage();

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      callback();
    });
    return () => unsubscribe(); // 组件卸载时取消订阅
  }, [subscribe, callback]);
}
