import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel
} from "@/components/ui/select"
import { useState } from "react";


const Calculator = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
/*     const { data, loading } = useQuery({
        fetcher: News.getDetail,
        params: { id },
    }); */
    const [value, setValue] = useState("banana")
    return <main className=" min-h-screen px-5">
        <AppNav title="计算器" />
        <section>
            <Select value={value} onValueChange={setValue} >
                <SelectTrigger className="w-full ">
                    <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </section>


    </main>
}

export default Calculator;
