import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/outline"; // 线框风格图标
import { useTranslation } from "react-i18next";
import clsx from "clsx";

interface NavItem {
  name: string;
  path: string;
  icon: string;
  activeIcon: string;
  count?: number
}

const BottomNav: React.FC = () => {
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    { name: t('BottomNav.home'), path: "/", icon: "https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/nav/nav-home.png", activeIcon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/nav/nav-home-active.png' },
    { name: t('BottomNav.mianban'), path: "/stock-quotes", icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/nav/nav-stock.png', activeIcon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/nav/nav-stock-active.png' },
    { name: t('BottomNav.shouyi'), path: "/follow", icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/app-nav/icon-ai.png', activeIcon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/app-nav/icon-ai-active.png' },
/*     { name: "理财", path: "/fund", icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/nav/nav-pos.png', activeIcon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/nav/nav-pos-active.png' },
 *//*     { name: "持仓", path: "/position", icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/nav/nav-pos.png', activeIcon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/nav/nav-pos-active.png' },
 */    { name: t('BottomNav.mine'), path: "/mine", icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/nav/nav-me.png', activeIcon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/nav/nav-me-active.png' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black  shadow-sm z-30 ios-safe-bottom">
      <ul className="flex justify-around" style={{margin:0}}>
        {navItems.map((item) => (
          <li key={item.name} className="w-full">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-center py-2 w-full transition-colors  ${isActive ? "text-[#c8a15a]" : "text-white"
                }`
              }
            >
              {({ isActive }) => (
                <div className=" relative flex flex-col items-center justify-center">
                  <span style={{ backgroundImage: `url(${isActive ? item.activeIcon : item.icon})` }} className={clsx(`size-6 block mx-auto bg-no-repeat bg-center bg-contain `)}></span>
                  <span className="absolute -top-1 right-0 text-red-500 text-xs  rounded-full">{item.count}</span>
                  <span className="text-xs mt-1">{item.name}</span>
                </div>
              )}

            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
