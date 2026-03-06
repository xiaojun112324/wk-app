import React, { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom'; // ✅ 加上 matchPath
import { IPropChild } from '@/types/IPropChild.type';
import { useRouteContext, connectRoute } from './routeContext';
import { routes as defaultRoutes } from '@/routers/routes';

const RouteProvider = ({ children }: IPropChild) => {
  const { store, setStore } = useRouteContext();
  const location = useLocation();

  // 初始化 routes
  useEffect(() => {
    if (!store.routes || store.routes.length === 0) {
      setStore({ routes: defaultRoutes });
    }
  }, []);

  // 同步当前路由对象
  useEffect(() => {
    if (store.routes && store.routes.length > 0) {
      const matchedRoute = store.routes.find((r) =>
        matchPath(
          { path: r.path, end: true },
          location.pathname
        )
      );

      setStore({ currentRoute: matchedRoute });
    }
  }, [location.pathname, store.routes]);

  return <>{children}</>;
};

export default connectRoute(RouteProvider);
