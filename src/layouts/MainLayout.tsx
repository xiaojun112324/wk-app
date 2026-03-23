import { ReactNode } from "react";
import BottomNav from "./components/BottomNav";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <div className="main-layout finance-page ios-safe-top">
        {children}
      </div>
      <div style={{ height: "calc(70px + var(--safe-area-bottom))" }} />
      <BottomNav />
    </>
  );
}

