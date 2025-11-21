// components/Slider.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Slider.module.css';

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
}

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const slides: Slide[] = [
    {
      id: 1,
      title: "Chào mừng đến với Website",
      description: "Khám phá những điều tuyệt vời từ chúng tôi",
      image: "/imgs/Banner_home_vixs.webp"
    },
    {
      id: 2,
      title: "Sản phẩm chất lượng",
      description: "Cam kết mang đến trải nghiệm tốt nhất",
      image: "/imgs/BANNER-KRX.webp"
    },
    {
      id: 3,
      title: "Dịch vụ chuyên nghiệp",
      description: "Đội ngũ hỗ trợ 24/7",
      image: "/imgs/2-banner-ramathtmoi.webp"
    },
    {
      id: 4,
      title: "Công nghệ hiện đại",
      description: "Luôn cập nhật những xu hướng mới nhất",
      image: "/imgs/Banner-VIX-AI-1-scaled.webp"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Giảm thời gian auto-play xuống 4s

    return () => clearInterval(interval);
  }, [currentSlide, autoPlay]);

  const handleMouseEnter = () => setAutoPlay(false);
  const handleMouseLeave = () => setAutoPlay(true);

  return (
    <div 
      className={styles.sliderContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slider Wrapper */}
      <div 
        className={styles.sliderWrapper}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id}
            className={styles.slide}
          >
            <div className={styles.slideContent}>
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className={styles.slideImage}
                priority={slide.id === 1}
                sizes="100vw"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons - Giống VIXS */}
      <button
        onClick={prevSlide}
        className={`${styles.navButton} ${styles.prevButton}`}
        aria-label="Slide trước"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className={`${styles.navButton} ${styles.nextButton}`}
        aria-label="Slide tiếp theo"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* Dots Indicator - Giống VIXS */}
      <div className={styles.dotsContainer}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`${styles.dot} ${
              index === currentSlide ? styles.dotActive : styles.dotInactive
            }`}
            aria-label={`Đến slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;