import { motion } from "framer-motion";

interface MarketBarProps {
    up: number;    // 上涨 %
    flat: number;  // 平盘 %
    down: number;  // 下跌 %
}

const MarketHolder: React.FC<MarketBarProps> = ({ up, flat, down }) => {
    const total = up + flat + down;

    // 防止总和不为100
    const upPercent = (up / total) * 100;
    const flatPercent = (flat / total) * 100;
    const downPercent = (down / total) * 100;

    return (
        <div className="w-full">
            <div className=" text-xs flex justify-between items-center w-full mb-1">
                <div className=" text-red-600">上涨{up}</div>
                <div className=" text-green-600">下跌{down}</div>
            </div>
            <div className="w-full h-2 flex rounded-lg overflow-hidden ">
                {/* 上涨 */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${upPercent}%` }}
                    transition={{ duration: 0.8 }}
                    className="bg-red-600 h-full"
                />
                {/* 平盘 */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${flatPercent}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-gray-400 h-full"
                />
                {/* 下跌 */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${downPercent}%` }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="bg-green-600 h-full"
                />
            </div>
        </div>
    );
};

export default MarketHolder;
