import { ReactNode } from "react";
import BottomNav from "./components/BottomNav";

interface MainLayoutProps {
  children: ReactNode;
}

export default function NavLayout({ children }: MainLayoutProps) {
  return (
    <>
      <div className="main-layout finance-page">
        {children}
      </div>
      <div className="sm:hidden h-[70px]">
        <BottomNav />
      </div>
    </>
  );
}

