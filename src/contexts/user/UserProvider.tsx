import React, { useEffect } from 'react';
import { IPropChild } from '@/types/IPropChild.type';
import { connectUser, useUserContext } from './userContext';


/**
 * UserProvider 组件
 * - 初始化自动拉取消息数量
 * - 提供全局 context
 */
const UserProviderInner: React.FC<IPropChild> = ({ children }) => {
  const { fetchUser, loading } = useUserContext();


  useEffect(() => {
    fetchUser(); // 页面加载立即获取消息数量
  }, []);
  if (loading) {
   // return <>loading</>
  }

  return <>{children}</>;
};

// 连接全局 Provider
const UserProvider = connectUser(UserProviderInner);
export default UserProvider;
