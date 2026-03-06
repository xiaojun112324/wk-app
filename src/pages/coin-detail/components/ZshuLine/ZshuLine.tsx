import { Area, AreaChart, CartesianGrid } from "recharts"
import { useId } from "react"
import {
    ChartContainer,
    type ChartConfig,
} from "@/components/ui/chart"
interface ChartDataItem {
    name: string | number
    desktop: number
}

function generateRandomData(length: number, min = 50, max = 350): ChartDataItem[] {
    return Array.from({ length }, (_, i) => ({
        name: i + 1, // 可以是索引 1,2,3...，也可以用其他命名
        desktop: Math.floor(Math.random() * (max - min + 1)) + min,
    }))
}

const chartData = generateRandomData(26)



interface ZshuLineProps {
    color?: string
}

export function ZshuLine({ color = "#e7000b" }: ZshuLineProps) {
    const gradientId = useId()
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: color,
        },
    } satisfies ChartConfig
    return (
        <ChartContainer config={chartConfig}>
            <AreaChart
                data={chartData}
                margin={{ left: 0, right: 0 }}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                        <stop offset="75%" stopColor={color} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>

                <CartesianGrid vertical={false} />

                <Area
                    dataKey="desktop"
                    type="linear"
                    stroke={color}               // 线条颜色
                    fill={`url(#${gradientId})`} // 渐变填充
                    fillOpacity={1}
                />
            </AreaChart>
        </ChartContainer>
    )
}
