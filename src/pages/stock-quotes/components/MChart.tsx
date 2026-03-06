
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

export const description = "A line chart"

const chartData = [
    { month: "January", date: "2026-03-01",desktop: 186 },
    { month: "February",date: "2026-03-01", desktop: 305 },
    { month: "March",date: "2026-03-01", desktop: 237 },
    { month: "April",date: "2026-03-01", desktop: 73 },
    { month: "May",date: "2026-03-01", desktop: 209 },
    { month: "June",date: "2026-03-01", desktop: 214 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function MChart() {
    return (
        <ChartContainer config={chartConfig}>
            <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 0,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                        const d = new Date(value)
                        return `${d.getMonth() + 1}/${d.getDate()}`
                    }}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Line
                    dataKey="desktop"
                    type="natural"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ChartContainer>
    )
}
