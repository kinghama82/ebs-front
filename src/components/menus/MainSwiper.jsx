"use client"
import { useRef } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Link from 'next/link';

export default function MainSwiper() {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          //오토플레이 시간 설정 1000 = 1초
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="mySwiper"
        style={{ height: "500px", width: "100%" }}
      >

        {/* <SwiperSlide></SwiperSlide> */}
        <SwiperSlide><Link href="https://tumblbug.com/gojapan"><img src='/4.png' /></Link></SwiperSlide>
        <SwiperSlide>
          <Link href="https://boardm.co.kr/front/product/product_detail.php?seq=83813&pinid=24176">
            <img src='/1.png' />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link href="https://boardm.co.kr/front/product/product_detail.php?seq=83814&pinid=24176">
            <img src='/2.png' />
          </Link>
        </SwiperSlide>
        <SwiperSlide><img src='/3.png' /></SwiperSlide>
        {/* <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide> */}
        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </>
  );
}
