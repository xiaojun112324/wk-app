import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./styles.css";
import { Link } from "react-router-dom";
import HcRateValue from "../HcRateValue";



interface Iprops {
    list: any[];
    slidesPerView?: number | "auto" | undefined;
    spaceBetween?: number;
}

export default function StockSwiper({
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
                        <Link className="w-full block" to={`/`}>
                            {item.name}
                            {item.code}
                            {item.nowPrice}
                            <div>
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
                            </div>

                        </Link>

                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
