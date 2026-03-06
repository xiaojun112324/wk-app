import { useCurrentRoute } from "@/contexts/route/useCurrentRoute";
import { ReactNode } from "react";

import Footer from "./components/Footer";

interface MainLayoutProps {
  children: ReactNode;
}
export default function MineLayout({ children }: MainLayoutProps) {
  const currentRoute = useCurrentRoute();


  return (
    <>

      <div className="h-[65px] sm:h-[116px]" />

      <div className="mine-layout block md:flex ">
        <div className=" w-[374px] hidden md:block">




        </div>
        <div className="flex-1  pt-6 px-4 min-w-0 pb-10">
          {children}
        </div>
      </div>
      <div className="">    <Footer /></div>

    </>
  );
}
