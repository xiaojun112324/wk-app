import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface CoinChartPoint {
    time: number;
    priceCny: number;
    changePct?: number;
}

interface Props {
    data: CoinChartPoint[];
}

const fmtDay = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()}`;
};

export function Chart({ data }: Props) {
    return (
        <div className="glass-card mt-3 p-3">
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                        <XAxis
                            dataKey="time"
                            tickFormatter={(v) => fmtDay(Number(v))}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#6a7f9f" }}
                        />
                        <YAxis
                            domain={["auto", "auto"]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#6a7f9f" }}
                            width={64}
                            tickFormatter={(v) => `￥${Number(v).toFixed(2)}`}
                        />
                        <Tooltip
                            formatter={(value: any) => [`￥${Number(value).toFixed(4)}`, "价格"]}
                            labelFormatter={(label) => new Date(Number(label)).toLocaleString()}
                        />
                        <Line
                            type="monotone"
                            dataKey="priceCny"
                            stroke="#1c4fb4"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
