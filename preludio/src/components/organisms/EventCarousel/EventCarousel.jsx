import { useState, useEffect, useRef } from 'react';
import { EventCard } from '../../molecules/Cards/EventCard/EventCard.jsx';
import './EventCarousel.css';

export function EventCarousel({ items = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useRef(null);

    const totalSlides = items.length;
    const tripleItems = [...items, ...items, ...items];
    const trackRef = useRef(null);
    const [slideSize, setSlideSize] = useState(0);

    // Auto-scroll every 5 seconds
    useEffect(() => {
        if (isPaused || totalSlides === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalSlides);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused, totalSlides]);

    useEffect(() => {
        const handleResize = () => {
            const track = trackRef.current;
            if (!track) return;
            const firstSlide = track.querySelector('.event-carousel__slide');
            if (!firstSlide) return;
            const slideRect = firstSlide.getBoundingClientRect();
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap || 0);
            setSlideSize(slideRect.width + gap);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [items]);

    if (!items.length) return <div className="empty">No hay eventos disponibles</div>;

    const goToSlide = (index) => {
        setCurrentIndex(index % totalSlides);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
    };

    // Calculate transform offset in pixels using measured slide size
    const offsetPx = -Math.round((currentIndex + totalSlides) * slideSize);

    return (
        <div
            className="event-carousel"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="event-carousel__container" ref={carouselRef}>
                <button
                    className="event-carousel__arrow event-carousel__arrow--left"
                    onClick={goToPrevious}
                    aria-label="Anterior"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="event-carousel__track-wrapper">
                    <div
                        className="event-carousel__track"
                        ref={trackRef}
                        style={{
                            transform: `translateX(${offsetPx}px)`,
                            transition: 'transform 0.5s ease-in-out',
                        }}
                    >
                        {tripleItems.map((event, index) => (
                            <div key={`${event._id || event.id}-${index}`} className="event-carousel__slide">
                                <EventCard event={event} />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="event-carousel__arrow event-carousel__arrow--right"
                    onClick={goToNext}
                    aria-label="Siguiente"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Dot indicators */}
            <div className="event-carousel__dots">
                {items.map((_, index) => (
                    <button
                        key={index}
                        className={`event-carousel__dot ${index === currentIndex ? 'event-carousel__dot--active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Ir a evento ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
