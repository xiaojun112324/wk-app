import React, { useEffect, useRef, useState } from 'react';

export interface TabItem {
    key: string | number;
    label: React.ReactNode;
}

interface TabsProps {
    tabs: TabItem[];
    value?: string | number;      // 受控
    defaultValue?: string | number; // 非受控
    onChange?: (key: string | number) => void;
}

const IntervalTab: React.FC<TabsProps> = ({
    tabs,
    value,
    defaultValue,
    onChange,
}) => {
    const isControlled = value !== undefined;

    const [innerValue, setInnerValue] = useState<
        string | number | undefined
    >(defaultValue ?? tabs[0]?.key);

    const activeKey = isControlled ? value : innerValue;

    // 横向滚动容器
    const scrollRef = useRef<HTMLDivElement | null>(null);

    // 每个 tab 的 ref
    const btnRefs = useRef<Record<string | number, HTMLButtonElement | null>>(
        {}
    );

    // 首次渲染不触发滚动
    const isFirstRender = useRef(true);

    /**
     * activeKey 变化时
     * 仅滚动横向 Tabs 容器
     */
    useEffect(() => {
        if (!activeKey) return;

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const container = scrollRef.current;
        const el = btnRefs.current[activeKey];

        if (!container || !el) return;

        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        // 计算需要滚动的距离（让当前 tab 居中）
        const offset =
            elRect.left -
            containerRect.left -
            (containerRect.width / 2 - elRect.width / 2);

        container.scrollBy({
            left: offset,
            behavior: 'smooth',
        });
    }, [activeKey]);

    const handleChange = (key: string | number) => {
        if (!isControlled) {
            setInnerValue(key);
        }
        onChange?.(key);
    };

    return (
        <div className="w-full">
            <div
                ref={scrollRef}
                className="
                    flex
                    gap-1
                    overflow-x-auto
                    whitespace-nowrap
                     no-scrollbar
                    px-2
                "
            >
                {tabs.map((tab) => {
                    const active = tab.key === activeKey;

                    return (
                        <button
                            key={tab.key}
                            ref={(el: any) => (btnRefs.current[tab.key] = el)}
                            onClick={() => handleChange(tab.key)}
                            className={`
                                relative
                                py-1
                                px-2
                                rounded
                                text-sm
                                transition-colors
                                ${active
                                    ? 'bg-primary text-white font-medium'
                                    : 'text-gray-500 hover:text-gray-800'
                                }
                            `}
                        >
                            {tab.label}

                        
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default IntervalTab;
