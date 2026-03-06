
import { BrowserRouter, useRoutes } from 'react-router-dom'; // 引入路由相关组件
import { Toaster } from 'sonner'

import MainLayout from "@/layouts/MainLayout";
import MineLayout from './layouts/MineLayout';
import EmptyLayout from "@/layouts/EmptyLayout";
import UserProvider from './contexts/user/UserProvider';
import RouteProvider from '@/contexts/route/RouteProvider';
/* import ScrollToTop from './components/ScrollToTop'; */

import { routes } from './routers/routes';
import RouteGuard from './routers/RouteGuard';

import ScrollToTopButton from './components/ScrollToTopButton';
import MessageCountProvider from './contexts/news/MessageCountProvider';
import CustomerServiceChat from './components/CustomerServiceChat';
import NavLayout from './layouts/NavLayout';
import { AliveScope, KeepAlive } from 'react-activation';




/* if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
} */
const layoutMap: Record<string, React.ComponentType<any>> = {
  main: MainLayout,
  empty: EmptyLayout,
  mine: MineLayout,
  nav: NavLayout
};
const AppRoutes = () => {
  const element = useRoutes(
    routes.map((route: any) => {
      let pageElement = route.element;
      // 根据 layout 决定最终的 Layout
      const Layout = layoutMap[route.layout] || EmptyLayout;
      // 如果需要 UserInfo，就包一层
      if (route.isUserInfo) {
        pageElement = (
          <UserProvider>
            {/*    <MessageCountProvider> */}
            <RouteGuard permission={route.permission}>
              <Layout>
                {pageElement}
              </Layout>
            </RouteGuard>

            {/*      </MessageCountProvider> */}

          </UserProvider>
        );
      } else {
        pageElement = (
          <Layout>
            {pageElement}
          </Layout>
        );
      }
      if (route.keepAlive) {
        pageElement = (
          <KeepAlive key={route.path} 
            name={route.path} saveScrollPosition="screen" autoFreeze={false}>
            {pageElement}
          </KeepAlive>
        );
      }

      return {
        ...route,
        element: pageElement,
      };
    })
  );

  return element;
};

function App() {

  return (
    <>

      <BrowserRouter>
        {/*    <ScrollToTop /> */}
        <AliveScope>
          <RouteProvider>
            <AppRoutes />
          </RouteProvider>
        </AliveScope>

      </BrowserRouter>
      <Toaster
        position="top-right"
        offset="calc(env(safe-area-inset-top) + 16px)"
        mobileOffset="calc(env(safe-area-inset-top) + 20px)"
      />
      <ScrollToTopButton />

    </>
  )
}

export default App
