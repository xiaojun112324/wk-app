import AnimatedHeaderWrapper from "@/layouts/components/AnimatedHeaderWrapper";
import Nav from "./Nav";
import { ReactNode } from "react";
interface IProps {
    title: string;
    right?: ReactNode;
    className?: string;
    backFallback?: string;
}


const AppNav = (props: IProps) => {

    return <>
        <AnimatedHeaderWrapper><Nav {...props} /></AnimatedHeaderWrapper>
        <div className="h-14" />
    </>
}

export default AppNav
