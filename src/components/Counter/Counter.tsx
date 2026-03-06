import React from "react";

interface CounterProps {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number) => void;
}

export const Counter: React.FC<CounterProps> = ({
    value,
    min = 0,
    max = 100,
    step = 1,
    onChange,
}) => {
    const decrement = () => {
        const newValue = Math.max(min, value - step);
        onChange?.(newValue);
    };

    const increment = () => {
        const newValue = Math.min(max, value + step);
        onChange?.(newValue);
    };

    return (
        <div className="inline-flex items-center border rounded overflow-hidden">
            <button
                type="button"
                onClick={decrement}
                className="px-3 py-1 bg-muted  disabled:opacity-50 "
                disabled={value <= min}
            >
                -
            </button>
            <input
                type="number"
                className="w-16 text-center border-l border-r focus:outline-none"
                value={value}
                onChange={(e) => {
                    let v = Number(e.target.value);
                    if (isNaN(v)) v = min;
                    v = Math.max(min, Math.min(max, v));
                    onChange?.(v);
                }}
            />
            <button
                type="button"
                onClick={increment}
                className="px-3 py-1 bg-muted disabled:opacity-50"
                disabled={value >= max}
            >
                +
            </button>
        </div>
    );
};
