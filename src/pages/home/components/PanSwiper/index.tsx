import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./styles.css";
import { Link } from "react-router-dom";
import HcRateValue from "@/components/HcRateValue";
import { getPriceColor } from "@/lib/getPriceColor";



interface Iprops {
    list: any[];
    slidesPerView?: number | "auto" | undefined;
    spaceBetween?: number;
}

export default function PanSwiper({
    list,
    slidesPerView = 1,
    spaceBetween = 10,
}: Iprops) {
    return (
        <div className="w-full relative">
            <Swiper
                slidesPerView={slidesPerView}
                spaceBetween={spaceBetween}
                freeMode={false}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
            >
                {list.map((item, index) => (
                    <SwiperSlide key={index}>
                        <Link className="w-full block text-center" to={`/`}>


                            <div className={getPriceColor(item?.preclose_px)}>{item?.preclose_px} <span className="inline-block ml-3">{item?.hcrate}%</span></div>
                            <div className=" flex items-center  gap-1 justify-center   mt-2 text-muted-foreground text-sm">{item?.name}       <div className=" text-red-700  font-bold">{item?.nowPrice}</div></div>
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

                        </Link>

                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
