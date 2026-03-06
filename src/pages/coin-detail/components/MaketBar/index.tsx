import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
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
import MarketHolder from "./MarketHolder"
import MaketSwiper from "../MaketSwiper"
export const description = "A bar chart"


const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig


interface IProps {
    quoteList: any
    maketLineList: any
    holderData: any
    loading?: boolean
}

export function MaketBar({ quoteList, maketLineList, holderData, loading }: IProps) {
    const CustomXAxisTick = ({ x, y, payload }: any) => {

        const data = maketLineList?.find((item: any) => item.month == payload.value)
        const textColor = data?.textColor || '#9ca3af'

        return (
            <text
                x={x}
                y={y + 10}
                textAnchor="middle"
                style={{ fill: textColor }}
                fontSize={12}
                className="text-red"
            >
                {payload.value}
            </text>
        )
    }
    const CustomBarLabel = ({ x, y, width, value, index }: any) => {
        const data = maketLineList?.[index]
        const color = data?.fill || '#9ca3af'

        return (
            <text
                x={x + width / 2}
                y={Math.max(y - 6, 12)}   // 防止超出顶部
                textAnchor="middle"
                fill={color}
                fontSize={12}
            >
                {value}
            </text>
        )
    }

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle className=" text-sm">市场概括</CardTitle>
                {quoteList?.length > 0 ? <MaketSwiper list={quoteList} /> : ''}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={maketLineList} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            interval={0}
                            axisLine={false}
                            tick={<CustomXAxisTick />}

                        /*   tickFormatter={(value) => value.slice(0, 3)} */
                        />
                    {/*     <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        /> */}
                        <Bar
                            dataKey="desktop"
                            fill="var(--color-desktop)"
                            radius={8}
                            label={<CustomBarLabel />}
                        >
                            {/*     <LabelList
                                dataKey="desktop"
                                position="top"
                                fill="#9ca3af"
                                fontSize={12}
                            /> */}
                        </Bar>

                        {/*       <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} /> */}
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="">
                {loading ? <></> : <MarketHolder up={holderData.up} flat={holderData.flat} down={holderData.down} />}

            </CardFooter>
        </Card>
    )
}