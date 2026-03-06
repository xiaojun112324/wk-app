import React from 'react'

export type SegmentOption<T extends string> = {
    label: string
    value: T
}

interface SegmentSwitchProps<T extends string> {
    options: SegmentOption<T>[]
    value: T
    onChange: (value: T) => void
}

export function SegmentSwitch<T extends string>({
    options,
    value,
    onChange,
}: SegmentSwitchProps<T>) {
    const activeIndex = options.findIndex(
        (item) => item.value === value
    )

    return (
        <div className="relative inline-flex rounded-full bg-[#1f2937] p-1">
            {/* 高亮背景 */}
            <div
                className="absolute top-1 bottom-1 rounded-full bg-[#c8a15a] transition-all duration-300"
                style={{
                    width: `calc(100% / ${options.length})`,
                    left: `calc(${activeIndex} * 100% / ${options.length})`,
                }}
            />

            {options.map((item) => {
                const isActive = item.value === value
                return (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => onChange(item.value)}
                        className={`relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-200
                            ${
                                isActive
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {item.label}
                    </button>
                )
            })}
        </div>
    )
}
