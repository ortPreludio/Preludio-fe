import { useState, useEffect, useRef } from 'react';
import { EventCard } from '../../molecules/EventCard/EventCard.jsx';
import './EventCarousel.css';

export function EventCarousel({ items = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useRef(null);

    if (!items.length) return <div className="empty">No hay eventos disponibles</div>;

    // Triple the items for infinite loop effect
    const tripleItems = [...items, ...items, ...items];
    const totalSlides = items.length;

    // Auto-scroll every 5 seconds
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalSlides);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused, totalSlides]);

    const goToSlide = (index) => {
        setCurrentIndex(index % totalSlides);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
    };

    // Calculate transform offset - show 3 cards, start at middle set
    const offset = -(currentIndex + totalSlides) * (100 / 3);

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
                    ❮
                </button>

                <div className="event-carousel__track-wrapper">
                    <div
                        className="event-carousel__track"
                        style={{
                            transform: `translateX(${offset}%)`,
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
                    ❯
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
