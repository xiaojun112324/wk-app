import clsx from "clsx";



interface IProps {
    value: string,
    className?: string;
}

export default function StockType({ value, className }: IProps) {
    const colorClass = (() => {
        switch (value) {
            case "沪":
                return "text-white bg-fuchsia-600"; // 紫色
            case "深":
                return "text-white bg-red-600";
            case "北":
                return "text-white bg-red-600";
            case "上":
                return "text-white bg-red-600";
            default:
                return "text-gray-500 bg-gray-100"; // 默认灰色
        }
    })();

    return <div
        className={clsx(
            "inline-block px-1 py-0.5  rounded text-xs  ",
            colorClass,
            className
        )}
    >
        {value}
    </div>;
}
