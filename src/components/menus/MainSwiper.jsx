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
        <SwiperSlide><Link href="https://brand.naver.com/asmodeekorea/products/11519633055?nl-query=%EC%8B%9C%ED%8B%B0%EC%A6%88+%EB%B3%B4%EB%93%9C%EA%B2%8C%EC%9E%84&nl-ts-pid=i9YZRdqVN8CssZAxeohssssstlN-024070&NaPm=ct%3Dm8h1922o%7Cci%3Da38ce7900e4b88bfda2fbfee4ed6b74d3b5de780%7Ctr%3Dsls%7Csn%3D2983750%7Chk%3D944ba5353e56a6a6775e7c6c11cd94db257f4c61"><img src='/3.png' /></Link></SwiperSlide>
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
