import { ChevronLeftIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline'
import { useCurrentRoute } from "@/contexts/route/useCurrentRoute";
import { useMemo, useState, useRef, useEffect, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBack } from "@/hooks/useBack";
import { useUserContext } from '@/contexts/user/userContext';
import { useTranslation } from "react-i18next";
import clsx from 'clsx';

interface IProps {
    title: string;
    right?: ReactNode;
    className?: string;
}

export default function Nav({ title, right, className }: IProps) {
    const { t } = useTranslation();
    const nav = useNavigate();
    const currentRoute: any = useCurrentRoute();
    const userContext = useUserContext();
    const { refresh } = userContext;
    const goBack = useBack("/");
    const searchRef = useRef<HTMLDivElement | null>(null);
    const profileRef = useRef<HTMLDivElement | null>(null);
    const searchButtonRefs = useRef<HTMLButtonElement[]>([]);

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const clickedSearchButton = searchButtonRefs.current.some(btn => btn && btn.contains(target));

            // 判断是否点击了 AntD Select 下拉框
            const isAntdDropdown = (target as HTMLElement).closest(".ant-select-dropdown");

            if (
                searchRef.current &&
                !searchRef.current.contains(target) &&
                !clickedSearchButton &&
                !isAntdDropdown
            ) {

            }

            if (profileRef.current && !profileRef.current.contains(target)) {

            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {


            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);



    return (
        <header className={clsx('relative bg-background', className)}>
            <div className="px-2 sm:px-4 lg:px-8">
                <div className="relative flex h-14 justify-between overflow-hidden min-w-0">
                    {/* 返回按钮 */}
                    <div className="relative z-10 flex px-2 w-10 lg:px-0 ">
                        <div className="flex shrink-0 items-center">
                            <ChevronLeftIcon className='w-5 font-bold ' onClick={goBack} />

                        </div>
                    </div>

                    {/* 标题 */}
                    <div className="min-w-0 absolute px-10 z-0   left-1/2 top-1/2 -translate-1/2 w-full ellipsis text-base text-center font-semibold">
                        {title}
                    </div>

                    {/* 右侧功能区 */}
                    <div className="relative z-10 flex items-center">
                        {right}
                    </div>


                </div>


            </div>


        </header>
    );
}
