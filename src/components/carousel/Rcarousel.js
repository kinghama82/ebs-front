"use client";
import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

export function EmblaCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

    useEffect(() => {
        if (emblaApi) {
            console.log(emblaApi.slideNodes()); // 슬라이드 노드들을 콘솔에 출력
        }
    }, [emblaApi]);

    return (
        <div className="embla" ref={emblaRef}>
            <div className="embla__container">
                <div className="embla__slide">Slide 1</div>
                <div className="embla__slide">Slide 2</div>
                <div className="embla__slide">Slide 3</div>
            </div>
        </div>
    );
}
