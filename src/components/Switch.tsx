import React, { useRef, useEffect, useState } from 'react'

export type SegmentOption<T extends string> = {
    label: string
    value: T
}

interface SegmentSwitchProps<T extends string> {
    options: SegmentOption<T>[]
    value: T
    onChange: (value: T) => void
}

export function Switch<T extends string>({
    options,
    value,
    onChange,
}: SegmentSwitchProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({})

    useEffect(() => {
        if (!containerRef.current) return

        const buttons = Array.from(containerRef.current.querySelectorAll<HTMLButtonElement>('button'))
        const activeIndex = options.findIndex(item => item.value === value)
        const activeButton = buttons[activeIndex]

        if (activeButton) {
            const rect = activeButton.getBoundingClientRect()
            const containerRect = containerRef.current.getBoundingClientRect()

            setHighlightStyle({
                width: rect.width,
                height: rect.height,
                left: rect.left - containerRect.left,
                top: rect.top - containerRect.top,
            })
        }
    }, [value, options])

    return (
        <div ref={containerRef} className="relative inline-flex rounded-full bg-accent">
            {/* 高亮背景 */}
            <div
                className="absolute  transition-all duration-300 p-1"
                style={highlightStyle}
            >
                <div className='rounded-full  w-full h-full'>

                </div>
            </div>

            {options.map(item => {
                const isActive = item.value === value
                return (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => onChange(item.value)}
                        className={`relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-200
              ${isActive ? '!text-primary' : '!text-gray-400'}`}
                    >
                        {item.label}
                    </button>
                )
            })}
        </div>
    )
}
