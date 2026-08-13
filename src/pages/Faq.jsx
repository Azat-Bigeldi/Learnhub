import { useState } from "react"
import { useLanguage } from "../i18n/useLanguage"

export default function Faq() {
    const { t } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex=== index ? null : index);
    };

    const faqData = t("faq.items");

    return (
        <section id="faq" className="scroll-anchor px-4 sm:px-6 md:px-12 lg:px-24 py-16 bg-bgo text-text">
            <div className="max-w-3xl mx-auto flex flex-col gap-8 md:gap-16">
                <h2 className="text-2xl sm:text-3xl font-serif text-center">{t("faq.heading")}</h2>
                <div className="flex flex-col gap-4">
                {faqData.map((item, index) => {
                    const isOpen = activeIndex === index;

                    return (
                    <div key={index} className="bg-white rounded-2xl shadow-sm px-6">

                        <button
                        onClick={() => toggleAccordion(index)}
                        aria-expanded={isOpen}
                        className="w-full flex justify-between items-center py-4 text-left cursor-pointer"
                        >
                        <span className="font-medium">{item.question}</span>
                        <span
                            className={`text-primary text-2xl transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}>
                            ▼
                        </span>
                        </button>

                        <div
                        className={`grid transition-[grid-template-rows] duration-300 ${
                            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                        >
                        <div className="overflow-hidden">
                            <p className="pb-4 text-text/70">
                            {item.answer}
                            </p>
                        </div>
                        </div>

                    </div>
                    );
                })}
                </div>
            </div>
        </section>
    );
}
