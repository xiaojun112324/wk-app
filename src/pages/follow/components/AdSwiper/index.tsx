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
    slidesPerView?: number | "auto";
    spaceBetween?: number;
}

export default function AdSwiper({
    list,
    spaceBetween = 10,
}: Iprops) {
    return (
        <div className=" relative flex"> {/* 必须给一个高度 */}
            <img className="h-[55px]" src="https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-ad.png" />
            <div className="flex-1 bg-[#fdf5eb] rounded-br-md rounded-tr-md">
                <Swiper
                    direction="vertical"      // 垂直滚动
                    slidesPerView={1}         // 一次显示3条
                    spaceBetween={spaceBetween}
                    loop={true}
                    style={{ height: '55px' }}         // 循环滚动
                    modules={[Autoplay]}
                    autoplay={{               // 可选自动滚动
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                >
                    {list.map((item, index) => (
                        <SwiperSlide key={index} className=" ">
                            <Link to={`/news/detail/${item?.id}`} className="flex items-center overflow-hidden min-w-0 h-[55px] pr-2">
                                <div className="text-xs break-words text-[#654328] flex-1 ellipsis-2 px-4">{item?.title}</div>
                                <div className=" bg-no-repeat bg-contain bg-center size-3 bg-[url(https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/ad-right.png)]"></div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
