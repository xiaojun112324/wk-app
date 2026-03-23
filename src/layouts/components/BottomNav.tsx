import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  HomeIcon as HomeOutline,
  Squares2X2Icon as SquaresOutline,
  ChartBarSquareIcon as ChartOutline,
  UserCircleIcon as UserOutline,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolid,
  Squares2X2Icon as SquaresSolid,
  ChartBarSquareIcon as ChartSolid,
  UserCircleIcon as UserSolid,
} from "@heroicons/react/24/solid";

interface NavItem {
  name: string;
  path: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  ActiveIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  count?: number;
}

const BottomNav: React.FC = () => {
  const navItems: NavItem[] = [
    { name: "首页", path: "/", Icon: HomeOutline, ActiveIcon: HomeSolid },
    { name: "算力面板", path: "/stock-quotes", Icon: SquaresOutline, ActiveIcon: SquaresSolid },
    { name: "钱包", path: "/follow", Icon: ChartOutline, ActiveIcon: ChartSolid },
    { name: "我的", path: "/mine", Icon: UserOutline, ActiveIcon: UserSolid },
  ];

  return (
    <nav
      className="ky-bottom-nav fixed bottom-0 left-0 right-0 z-30 ios-safe-bottom"
      style={{ transform: "translateZ(0)" }}
    >
      <div className="mx-auto w-full max-w-[560px]">
        <ul className="flex h-[70px] justify-around" style={{ margin: 0 }}>
          {navItems.map((item) => (
            <li key={item.name} className="w-full">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    "ky-nav-item flex h-full items-center justify-center w-full transition-colors",
                    isActive ? "text-[#1b437f]" : "text-[#7083a3]"
                  )
                }
              >
                {({ isActive }) => {
                  const IconComp = isActive ? item.ActiveIcon : item.Icon;
                  return (
                    <div className="relative flex flex-col items-center justify-center">
                      <span className="h-[9px]" />
                      <IconComp className="size-6" />
                      {!!item.count && (
                        <span className="absolute top-0 right-0 text-[10px] bg-red-500 text-white rounded-full px-1">
                          {item.count}
                        </span>
                      )}
                      <span className="text-[11px] mt-1 font-semibold tracking-[0.2px]">{item.name}</span>
                    </div>
                  );
                }}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default BottomNav;
