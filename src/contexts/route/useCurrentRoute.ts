import { useRouteContext as useCtx } from '@/contexts/route/routeContext';
import { IRoute } from '@/contexts/route/routeContext';

export const useCurrentRoute = (): IRoute | undefined => {
  const { store } = useCtx();
  return store.currentRoute;
};
