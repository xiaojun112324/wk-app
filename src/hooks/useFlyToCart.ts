import { useState, useRef } from "react";

export interface FlyItem {
    id: number;
    img: string;
    startX: number;
    startY: number;
}

export const useFlyToCart = () => {
    const [flyingItems, setFlyingItems] = useState<FlyItem[]>([]);
    const cartRef = useRef<HTMLDivElement | HTMLButtonElement>(null);

    const flyToCart = (img: string, startX: number, startY: number) => {
        const id = Date.now();
        setFlyingItems((prev) => [...prev, { id, img, startX, startY }]);

        // 0.8秒后自动移除
        setTimeout(() => {
            setFlyingItems((prev) => prev.filter((item) => item.id !== id));
        }, 800);
    };

    return { flyingItems, flyToCart, cartRef, setFlyingItems };
};
