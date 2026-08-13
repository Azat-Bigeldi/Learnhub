import { useState } from "react";
import { useLanguage } from "../i18n/useLanguage";

// Имена студентов — собственные имена, они не переводятся при смене языка.
const results = [
    { name: "Нурай", score: 45, image: "./public/results/result1.png" },
    { name: "Айым", score: 45, image: "./public/results/result2.png" },
    { name: "Айдана", score: 50, image: "./public/results/result3.png" },
    { name: "Бекзат", score: 47, image: "./public/results/result4.png" },
];

export default function Results() {
    const { t } = useLanguage();
    const [current, setCurrent] = useState(0);
    const [imageFailed, setImageFailed] = useState({});
    const { name, score, image } = results[current];
    const subject = t("common.subjectPhysics");

    const goToSlide = (index) => setCurrent(index);
    const nextSlide = () => setCurrent((prev) => (prev === results.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? results.length - 1 : prev - 1));

    const hasImage = image && !imageFailed[current];

    return (
        <section id="results" className="scroll-anchor px-4 sm:px-6 md:px-12 py-16 bg-bg text-text">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-text text-center">
                    {t("results.heading")}
                </h2>
                <p className="text-base sm:text-lg font-light leading-7 text-[#596063] text-center max-w-2xl mx-auto mt-4 mb-8 md:mb-12">
                    {t("results.subtitle")}
                </p>
                <div className="relative w-full h-[260px] sm:h-[340px] md:h-[462px] mx-auto rounded-[20px] overflow-hidden bg-[#0d0d0d]">
                    <button
                        type="button"
                        aria-label={t("results.prevAria")}
                        className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/30 text-white text-lg flex items-center justify-center shadow-md transition-colors hover:bg-white/40"
                        onClick={prevSlide}
                    >
                        ←
                    </button>

                    <div className="relative w-full h-full flex flex-col items-center justify-center gap-3 sm:gap-4">
                        {hasImage ? (
                            <img
                                src={image}
                                alt={t("results.resultImageAlt", { name })}
                                className="max-w-full h-[75%] object-contain"
                                onError={() => setImageFailed((prev) => ({ ...prev, [current]: true }))}
                            />
                        ) : (
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl sm:text-3xl font-serif">
                                {name.charAt(0)}
                            </div>
                        )}
                        <p className="text-center font-bold text-sm sm:text-lg text-white px-4">
                            {name} • {subject} • {score}
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label={t("results.nextAria")}
                        className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/30 text-white text-lg flex items-center justify-center shadow-md transition-colors hover:bg-white/40"
                        onClick={nextSlide}
                    >
                        →
                    </button>
                </div>
                <div className="flex justify-center gap-2 mt-6">
                    {results.map((result, index) => (
                        <button
                            type="button"
                            key={result.name}
                            aria-label={t("results.showResultAria", { name: result.name })}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                                index === current ? "bg-primary" : "bg-orange-200"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
