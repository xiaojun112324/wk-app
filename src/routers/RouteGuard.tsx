import { ReactNode, useMemo } from "react";
import { matchPath, Navigate, useLocation } from "react-router-dom";
import { getToken } from "@/lib/token";

interface RouteGuardProps {
  permission?: string;
  children: ReactNode;
}

const PUBLIC_PATH_PATTERNS = [
  "/",
  "/login",
  "/register",
  "/pow-rank",
  "/global-farms",
  "/global-farms/:id",
  "/calculator",
  "/coin-detail/:id",
];

const isPublicPath = (pathname: string) =>
  PUBLIC_PATH_PATTERNS.some((pattern) => matchPath({ path: pattern, end: true }, pathname));

const RouteGuard = ({ children }: RouteGuardProps) => {
  const location = useLocation();
  const token = getToken();

  const loginUrl = useMemo(() => {
    const current = `${location.pathname}${location.search || ""}`;
    return `/login?orgUrl=${encodeURIComponent(current)}`;
  }, [location.pathname, location.search]);

  if (!token && !isPublicPath(location.pathname)) {
    return <Navigate to={loginUrl} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
