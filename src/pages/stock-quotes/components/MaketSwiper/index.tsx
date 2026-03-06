import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./styles.css";
import { getPriceColor } from "@/lib/getPriceColor";

interface Iprops {
    list: any[];
    slidesPerView?: number | "auto";
    spaceBetween?: number;
}

export default function MaketSwiper({
    list,
    spaceBetween = 10,
}: Iprops) {
    return (
        <div className=" relative"> {/* 必须给一个高度 */}
            <Swiper
                direction="vertical"      // 垂直滚动
                slidesPerView={1}         // 一次显示3条
                spaceBetween={spaceBetween}
                loop={true}
                style={{ height: '30px' }}         // 循环滚动
                modules={[Autoplay]}
                autoplay={{               // 可选自动滚动
                    delay: 2000,
                    disableOnInteraction: false,
                }}
            >
                {list.map((item, index) => (
                    <SwiperSlide key={index} className=" block overflow-hidden">
                        <section className=" flex items-center gap-2">
                            <div className="text-sm text-gray-400 mb-1">{item?.secu_name}</div>
                            <div className={getPriceColor(item?.last_px)}>
                                {item?.last_px}
                         {/*        <span className="inline-block ml-3">{item?.hcrate || 0}%</span> */}
                            </div>

                        </section>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
