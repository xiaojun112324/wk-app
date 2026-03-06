import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./styles.css";
import { Link } from "react-router-dom";
import HcRateValue from "@/components/HcRateValue";
import { getPriceColor } from "@/lib/getPriceColor";
import { ZshuLine } from "../ZshuLine/ZshuLine";



interface Iprops {
    list: any[];
    slidesPerView?: number | "auto" | undefined;
    spaceBetween?: number;
}

export default function ZshuSwiper({
    list,
    spaceBetween = 10,
}: Iprops) {
    return (
        <div className="w-full relative">
            <Swiper
                slidesPerView={'auto'}
                spaceBetween={spaceBetween}
                freeMode={true}
                loop={false}

                modules={[FreeMode]}
            >
                {list?.map((item, index) => (
                    <SwiperSlide key={index} className="  rounded-lg  pt-3 bg-accent block overflow-hidden" style={{ width: '150px' }}>
                        <section className="px-2 mb-2">
                            <div className=" text-sm text-gray-400 mb-1">{item?.name} </div>
                            <div className=" text-red-600 font-semibold text-xl">{item?.nowPrice}</div>
                            <div className={getPriceColor(item?.preclose_px)}>{item?.preclose_px} <span className="inline-block ml-3">{item?.hcrate || 0}%</span></div>
                        </section>
                {/*         <section className="-mb-[2px]">
                            <ZshuLine color={item?.preclose_px > 0 ? '#e7000b' : '#00a63e'} />
                        </section> */}
                        {/*       <div>
                                <HcRateValue hcrate={item.hcrate} preclosePx={item.preclose_px} />
                            </div>
                            <div>
                                <div>最高</div>
                                <div>   {item.today_max}</div>
                            </div>
                            <div>
                                <div>最低</div>
                                <div>   {item.today_min}</div>
                            </div>
                            <div>
                                <div>现价</div>
                                <div>   {item.nowPrice}</div>
                            </div> */}


                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
