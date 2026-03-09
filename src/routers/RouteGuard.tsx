// components/RouteGuard.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '@/lib/token';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';


//路由权限

interface RouteGuardProps {
  permission?: string;
  children: ReactNode;
}

const RouteGuard = ({ permission, children }: RouteGuardProps) => {
  const location = useLocation();
  const token = getToken();
  const loginUrl = useMemo(() => {
    const current = `${location.pathname}${location.search || ""}`;
    return `/login?orgUrl=${encodeURIComponent(current)}`;
  }, [location.pathname, location.search]);

  // 未登录：拦截受保护路由，统一跳转登录页
  if (!token) {
    return <Navigate to={loginUrl} replace />;
  }

  return <>{children}</>;

  // 路由级权限数组

  // 无权限：可以选择跳转或返回一个提示
  return <Navigate to="/404" replace />;
};

export default RouteGuard;
