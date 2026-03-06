import { useCurrentRoute } from "@/contexts/route/useCurrentRoute";
import { ReactNode } from "react";

import AnimatedHeaderWrapper from "./components/AnimatedHeaderWrapper";
import BottomNav from "./components/BottomNav";
interface MainLayoutProps {
  children: ReactNode;
}
export default function NavLayout({ children }: MainLayoutProps) {
  const currentRoute = useCurrentRoute();

  return (
    <>



      <div className="main-layout">
        {children}
      </div>
      {/*    <div className="">
        <Footer />
      </div> */}
      <div className="sm:hidden h-[61px]">
        <BottomNav />
      </div>
    </>
  );
}
