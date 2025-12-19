import { useEffect, useMemo, useRef, useState } from "react";

export default function EventBannerCarousel({
    images = [],
    alt = "Event banner",
    autoPlay = true,
    interval = 4500,
}) {
    const slides = useMemo(() => (images || []).filter(Boolean), [images]);

    const [active, setActive] = useState(0);
    const startX = useRef(null);
    const timerRef = useRef(null);

    const hasSlides = slides.length > 0;

    const goTo = (idx) => {
        if (!hasSlides) return;
        const next = (idx + slides.length) % slides.length;
        setActive(next);
    };

    const next = () => goTo(active + 1);
    const prev = () => goTo(active - 1);

    // autoplay
    useEffect(() => {
        if (!autoPlay || slides.length <= 1) return;

        timerRef.current = setInterval(() => {
            setActive((p) => (p + 1) % slides.length);
        }, interval);

        return () => clearInterval(timerRef.current);
    }, [autoPlay, interval, slides.length]);

    // touch swipe (mobile)
    const onTouchStart = (e) => {
        startX.current = e.touches?.[0]?.clientX ?? null;
    };

    const onTouchEnd = (e) => {
        if (startX.current == null) return;
        const endX = e.changedTouches?.[0]?.clientX ?? startX.current;
        const diff = startX.current - endX;

        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
        }
        startX.current = null;
    };

    if (!hasSlides) {
        return (
            <div className="w-full h-[240px] sm:h-[320px] rounded-2xl border overflow-hidden bg-gray-100 animate-pulse" />
        );
    }

    return (
        <div
            className="relative w-full h-[240px] sm:h-[320px] rounded-2xl border overflow-hidden bg-gray-100"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {/* Slides */}
            <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${active * 100}%)` }}
            >
                {slides.map((src, idx) => (
                    <div
                        key={`${src}-${idx}`}
                        className="w-full h-full shrink-0 flex items-center justify-center bg-gray-100"
                    >
                        <img
                            src={src}
                            alt={alt}
                            className="
                                max-w-full
                                max-h-full
                                object-contain
                            "
                            loading={idx === 0 ? "eager" : "lazy"}
                        />
                    </div>
                ))}
            </div>

            {/* Left / Right arrows (desktop) */}
            {slides.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={prev}
                        className="hidden sm:grid absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 place-items-center rounded-full bg-white/90 hover:bg-white shadow ring-1 ring-black/5 transition"
                        aria-label="Previous banner"
                    >
                        <span className="text-xl leading-none">‹</span>
                    </button>

                    <button
                        type="button"
                        onClick={next}
                        className="hidden sm:grid absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 place-items-center rounded-full bg-white/90 hover:bg-white shadow ring-1 ring-black/5 transition"
                        aria-label="Next banner"
                    >
                        <span className="text-xl leading-none">›</span>
                    </button>
                </>
            )}

            {/* Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => goTo(idx)}
                            className={[
                                "h-2.5 rounded-full transition-all",
                                idx === active
                                    ? "w-6 bg-white"
                                    : "w-2.5 bg-white/60 hover:bg-white/80",
                            ].join(" ")}
                            aria-label={`Go to banner ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
