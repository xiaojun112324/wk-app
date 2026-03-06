import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./styles.css";
import { getPriceColor } from "@/lib/getPriceColor";
import { Link } from "react-router-dom";

interface Iprops {
    list: any[];
    spaceBetween?: number;
    onClick?: (item: any, index: number) => void
}

export default function FollowItesSwiper({
    list,
    spaceBetween = 10,
    onClick
}: Iprops) {
    const handleClick = (item: any, index: number) => {
        console.log(item)
        onClick?.(item, index)
    };

    return (
        <Swiper
            slidesPerView={3}
            spaceBetween={spaceBetween}
            modules={[FreeMode]}
        >
            {list.map((item, index) => (
                <SwiperSlide key={index} className="bg-muted rounded-lg" onClick={() => handleClick(item, index)}>
                    <div className="flex-1  px-2 py-4 text-sm overflow-hidden min-w-0 " >
                        <div className=" bg-no-repeat bg-center bg-cover rounded-full size-17 mx-auto" style={{ backgroundImage: `url(${item?.mentorAvatarUrl})` }}></div>
                        <div className=" text-center mt-2 mb-2 text-foreground">{item?.mentorTitle}</div>
                        <div className="ellipsis-2 text-xs text-muted-foreground h-8">{item?.followDescription}</div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
