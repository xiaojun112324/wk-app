import { useCurrentRoute } from "@/contexts/route/useCurrentRoute";
import { ReactNode } from "react";

import AnimatedHeaderWrapper from "./components/AnimatedHeaderWrapper";
import BottomNav from "./components/BottomNav";
interface MainLayoutProps {
  children: ReactNode;
}
export default function MainLayout({ children }: MainLayoutProps) {
  const currentRoute = useCurrentRoute();

  return (
    <>
      {/*    <AnimatedHeaderWrapper><Header /></AnimatedHeaderWrapper> */}


      <div className="main-layout">
        {children}
      </div>
      {/*    <div className="">
        <Footer />
      </div> */}
      <div className="ios-safe-bottom">
        <div className=" h-[61px]">
          <BottomNav />
        </div>

      </div>

    </>
  );
}
