// components/PageTitle.tsx
import React from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { Headset, MessageSquare } from "lucide-react";

import { useTranslation } from "react-i18next";


interface IProps {
    avatar: string
}

const Header: React.FC<IProps> = ({
    avatar

}) => {
    const { t } = useTranslation();
    return (
        <div className="flex justify-between items-center gap-3">
            <div className="flex items-center ">
                <Link to="/mine"> <div className="size-8 rounded-full  bg-center bg-contain bg-no-repeat" style={{backgroundImage:`url(${avatar})`}} /></Link>
                {/*     <ChatBubbleLeftEllipsisIcon className=" size-5 text-white" /> */}
            </div>
            <Link to="/search" className="bg-accent rounded-full flex items-center py-1 px-2 flex-1">
                <MagnifyingGlassIcon className=" size-5 text-muted-foreground" /><div className="flex-1 text-xs text-muted-foreground  border-0 pl-2 py-1 placeholder:text-sm outline-0">搜索股票</div>
            </Link>
            <div className="flex items-center ">
                <Link to="/stock/hot"> <img className="h-8" src="https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/hot-bang.png" /></Link>
                {/*     <ChatBubbleLeftEllipsisIcon className=" size-5 text-white" /> */}
            </div>
            {/*      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            {moreLink && (
                <Link
                    to={moreLink}
                    className="text-sm flex items-center gap-1"
                >
                    {moreText || t('PageTitle.more')}
                    <ArrowRightIcon className="w-5" />
                </Link>
            )} */}
        </div>
    );
};

export default Header;
