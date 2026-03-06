import { ReactNode } from "react";
import BottomNav from "./components/BottomNav";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <div className="main-layout finance-page">
        {children}
      </div>
      <div className="ios-safe-bottom">
        <div className="h-[70px]">
          <BottomNav />
        </div>
      </div>
    </>
  );
}

