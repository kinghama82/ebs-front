import { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MainCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 10000 })]); // 3초마다 자동 이동
    const carouselRef = useRef(null);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.reInit(); // AutoPlay가 정상 작동하도록 초기화
    }, [emblaApi]);

    return (
        <div className="relative max-w-6xl mx-auto rounded-lg overflow-hidden">
            {/* 왼쪽 화살표 버튼 */}
            <button
                onClick={scrollPrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
            >
                <ChevronLeft size={20} />
            </button>

            {/* 캐러셀 */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="flex-none w-1/3 h-40 bg-gray-700 rounded-lg flex items-center justify-center text-white text-xl"
                        >
                            Slide {index + 1}
                        </div>
                    ))}
                </div>
            </div>

            {/* 오른쪽 화살표 버튼 */}
            <button
                onClick={scrollNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default MainCarousel;
