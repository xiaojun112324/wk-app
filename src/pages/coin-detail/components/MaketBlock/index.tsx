import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import clsx from "clsx"
import BigNumber from "bignumber.js"
import { getPriceColor } from "@/lib/getPriceColor"

interface IProps {
    title: string
    list: any
}

export function MaketBlock({ title, list }: IProps) {
    const getpercent = (num: any) => {
        return new BigNumber(num || 0)
            .times(100)
            .toFixed(2) + '%'
    }
    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle className=" text-sm text-muted-foreground">{title}</CardTitle>

            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center mt-5">
                    {list?.map((item: any,idx:number) => <div key={idx} className="text-center">
                        <div className=" text-sm  text-muted-foreground mb-3">{item.secu_name}</div>

                        <div className={clsx('my-1 font-semibold', getPriceColor(item?.change))}>{getpercent(item?.change)}</div>

                        <div ><span className="text-xs text-muted-foreground inline-block mr-1">{item?.up_stock[0]?.secu_name}</span><span className={clsx('text-xs', getPriceColor(item?.up_stock[0]?.change))}>{getpercent(item?.up_stock[0]?.change)}</span></div>

                    </div>)}


                </div>

            </CardContent>
            <CardFooter className="">

            </CardFooter>
        </Card>
    )
}