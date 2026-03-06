// components/RouteGuard.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';


//路由权限

interface RouteGuardProps {
  permission?: string;
  children: ReactNode;
}

const RouteGuard = ({ permission, children }: RouteGuardProps) => {

  return <>{children}</>;

  // 路由级权限数组

  // 无权限：可以选择跳转或返回一个提示
  return <Navigate to="/404" replace />;
};

export default RouteGuard;
