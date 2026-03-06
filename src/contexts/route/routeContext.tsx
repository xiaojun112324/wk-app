import { useAppContext, connectFactory } from '../contextFactory';
import { IPropChild } from '@/types/IPropChild.type';
import { JSX } from 'react';

// 路由项类型
export interface IRoute {
  path: string;
  key?: string;
  element: JSX.Element;
  title?: string;
  permission?: string;
  isUserInfo?: boolean;
  meta?: Record<string, any>;
  isShowReturn?: boolean;
}

// context 数据类型
export interface IRouteStore {
  routes: IRoute[];
  currentRoute?: IRoute;
  setCurrentRoute?: (path: string) => void;
}

const KEY = 'routeInfo';
const DEFAULT_VALUE: IRouteStore = {
  routes: [],
  currentRoute: undefined,
};

export const useRouteContext = () => useAppContext<IRouteStore>(KEY);

// 高阶组件，包裹 Provider
export const connectRoute = connectFactory(KEY, DEFAULT_VALUE);
