import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useBack } from "@/hooks/useBack";
import clsx from "clsx";

interface IProps {
    title: ReactNode;
    right?: ReactNode;
    className?: string;
    backFallback?: string;
}

export default function Nav({ title, right, className, backFallback = "/" }: IProps) {
    const { search } = useLocation();
    const from = new URLSearchParams(search).get("from");
    const resolvedFallback = from === "register" ? "/register" : from === "login" ? "/login" : backFallback;
    const goBack = useBack(resolvedFallback);

    return (
        <header className={clsx("sticky top-0 z-20", className)}>
            <div className="mx-3 mt-2 rounded-2xl border border-[#cfe0ff] bg-white/85 backdrop-blur-md shadow-[0_8px_24px_rgba(20,99,255,0.12)]">
                <div className="relative flex h-12 items-center justify-between px-2 min-w-0">
                    <button className="relative z-10 flex h-9 w-9 items-center justify-center rounded-xl text-[#1a4da8] hover:bg-[#edf3ff]" onClick={goBack}>
                        <ChevronLeftIcon className="w-5 font-bold" />
                    </button>

                    <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-12 text-center text-[15px] font-extrabold tracking-[0.2px] text-[#163665] truncate">
                        {title}
                    </div>

                    <div className="relative z-10 flex items-center min-w-[36px] justify-end">{right}</div>
                </div>
            </div>
        </header>
    );
}
