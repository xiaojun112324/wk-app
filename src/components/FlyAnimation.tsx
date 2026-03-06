import React from "react";
import { motion } from "framer-motion";
import { FlyItem } from "@/hooks/useFlyToCart";

interface FlyAnimationProps {
    flyingItems: FlyItem[];
    cartRef: React.RefObject<HTMLElement>;
}

export const FlyAnimation: React.FC<FlyAnimationProps> = ({ flyingItems, cartRef }) => {
    return (
        <>
            {flyingItems.map((item) => {
                const cartRect = cartRef.current?.getBoundingClientRect();
                const endX = cartRect ? cartRect.left + cartRect.width / 2 - 16 : item.startX;
                const endY = cartRect ? cartRect.top + cartRect.height / 2 - 16 : item.startY;

                return (
                    <motion.img
                        key={item.id}
                        src={item.img}
                        className="w-8 h-8 rounded-full fixed z-50 pointer-events-none"
                        initial={{ x: item.startX, y: item.startY, scale: 1 }}
                        animate={{ x: endX, y: endY, scale: 0.3 }}
                        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                    />
                );
            })}
        </>
    );
};
