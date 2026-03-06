import React, { useEffect, useRef } from 'react';
import { IPropChild } from '@/types/IPropChild.type';
import { connectMessageCount, useMessageCountContext } from './messageCountContext';


/**
 * MessageCountProvider 组件
 * - 初始化自动拉取消息数量
 * - 提供全局 context
 */
const MessageCountProviderInner: React.FC<IPropChild> = ({ children }) => {
  const { fetchCount } = useMessageCountContext();
  const intervalRef = useRef<any>(null);


  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchCount();
      intervalRef.current = setInterval(fetchCount, 3000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }


  }, []);

  return <>{children}</>;
};

// 连接全局 Provider
const MessageCountProvider = connectMessageCount(MessageCountProviderInner);
export default MessageCountProvider;
