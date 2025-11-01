// components/Carousel.tsx
"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type CarouselItem = {
  _id?: string;
  title?: string;
  imageUrl?: string;
  link?: string;
};

interface CarouselProps {
  items: CarouselItem[];
  autoplayMs?: number | null;
  /** max visual width in px — match your main container (1100 in index.tsx) */
  maxWidth?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  items = [],
  autoplayMs = 4000,
  maxWidth = 1100,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <section style={{ marginTop: 18, width: "100%" }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            maxWidth: `${maxWidth}px`,
            aspectRatio: "3 / 1", // keep as-is; change to "16 / 9" if you want classic widescreen
            position: "relative",
            overflow: "hidden",
            borderRadius: 8,
            background: "#f5f5f5",
          }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={12}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={
              autoplayMs
                ? { delay: autoplayMs, disableOnInteraction: false }
                : false
            }
            loop={true}
            speed={700}
            style={{ width: "100%", height: "100%" }}
          >
            {items.map((item) => (
              <SwiperSlide key={item._id || item.title || Math.random()}>
                <a
                  href={item.link || "#"}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "block",
                    width: "100%",
                    height: "100%",
                    textDecoration: "none",
                  }}
                  aria-label={item.title || "carousel item"}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title || "carousel image"}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Styling */}
          <style jsx global>{`
            /* === Navigation Arrows === */
            .swiper-button-next,
            .swiper-button-prev {
              color: #333;
              background: #ffffff;
              border-radius: 50%;
              width: 38px;
              height: 38px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
              top: 50%;
              transform: translateY(-50%);
              transition: all 0.3s ease;
            }

            .swiper-button-next::after,
            .swiper-button-prev::after {
              font-size: 16px;
              font-weight: bold;
            }

            /* Move arrows OUTSIDE the carousel */
            .swiper-button-prev {
              left: -52px;
            }
            .swiper-button-next {
              right: -52px;
            }

            /* Hover effect for desktop */
            .swiper-button-next:hover,
            .swiper-button-prev:hover {
              background: #ffd24c; /* Study-Hub yellow accent */
              color: #000;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
            }

            /* Hide navigation arrows on mobile */
            @media (max-width: 768px) {
              .swiper-button-next,
              .swiper-button-prev {
                display: none !important;
              }
            }

            /* === Pagination Dots === */
            .swiper-pagination-bullet {
              background: #ccc;
              opacity: 0.8;
            }
            .swiper-pagination-bullet-active {
              background: #ffd24c; /* Match your theme */
              opacity: 1;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
