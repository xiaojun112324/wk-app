import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Scrollbar, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./styles.css";

import { useNavigate, useLocation } from 'react-router-dom';



interface ShopSwiperProps {
    shops: any[];
    slidesPerView?: number | "auto" | undefined; // 可选，默认 3
    spaceBetween?: number; // 可选，默认 20
}

export default function ShopSwiper({
    shops,
    slidesPerView = "auto",
    spaceBetween = 10,
}: ShopSwiperProps) {
    const nav = useNavigate();
    return (
        <div className=" w-full">
            <Swiper
                slidesPerView={slidesPerView}  // 自动根据Slide宽度计算
                spaceBetween={spaceBetween}
                freeMode={true}
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                modules={[FreeMode, Autoplay]}

            >
                {shops.map((store, index) => (
                    <SwiperSlide key={index} style={{ width: 390 }} onClick={() => {


                    }}>
                        <div className="w-[390px]"> {/* 固定宽度 */}
                       {/*      <MerchantCard
                                avatar={store?.storeLogo}
                                name={store?.name}
                                rating={Number(store?.storeScore || 0)}
                                sold={store?.salesCount}
                                views={store?.viewsNum}
                                rate={store?.storeScore}
                                isFollowed={store?.collectFlag}
                                id={store?.id}
                            /> */}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
