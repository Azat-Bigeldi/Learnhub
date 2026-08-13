import { useState } from "react"
import play from "../imgsourse/play.png"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { openWhatsApp } from "../utils/WhatsApp"
import { useLanguage } from "../i18n/useLanguage"
import TaskNumberAccordion from "../components/TaskNumberAccordion"

// Количество уроков в каждом модуле не зависит от языка, поэтому хранится
// отдельно от переводимых заголовков и тем (см. locales/*.js -> coursePage.modules).
const MODULE_LESSON_COUNTS = [8, 10, 6]

function AccordionItem({ module, lessonsCount, lessonsLabel, index, isOpen, onToggle }) {
    const { t } = useLanguage();
    return (
        <div className="border-b border-gray-200">
            <button
                className="w-full flex items-center justify-between py-6 text-left"
                onClick={() => onToggle(index)}
            >
                <div className="flex items-center gap-6">
                    <span className="text-gray-300 text-lg font-serif">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                        <h3 className="text-lg text-text">{module.title}</h3>
                        <p className="text-sm text-text/50">{lessonsCount} {lessonsLabel}</p>
                    </div>
                </div>
                <svg
                    className={`w-5 h-5 text-text/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
                <div className="overflow-hidden">
                    <div className="pb-6 pl-0 md:pl-16">
                        <TaskNumberAccordion
                            tasks={module.topics}
                            heading={t("coursePage.topicsHeading")}
                            linkBuilder={(topicIndex) => `/courses/lesson/${index}/${topicIndex}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CoursePage() {
    const { t } = useLanguage();
    useDocumentTitle(t("meta.courses"))
    const [openIndex, setOpenIndex] = useState(null)

    const modules = t("coursePage.modules")
    const lessonsLabel = t("coursePage.lessonsLabel")

    const handleToggle = (index) => {
        setOpenIndex((prev) => (prev === index ? null : index))
    }

    const handleEnroll = () => {
        openWhatsApp(t("whatsapp.enrollMessage"))
    }

    return (
        <div className="bg-bg text-text">
            <section className="px-4 sm:px-6 md:px-24 py-12 md:py-16 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    {/* левая колонка */}
                    <div className="flex flex-col gap-6">
                        <span className="inline-block w-fit bg-white border border-gray-200 text-xs uppercase tracking-wide px-4 py-1.5 rounded-full">
                            {t("coursePage.subjectBadge")}
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-serif leading-tight">
                            {t("coursePage.title")}
                        </h1>
                        <p className="text-text/70 leading-relaxed">
                            {t("coursePage.description")}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4">
                            <button
                                onClick={handleEnroll}
                                className="bg-primary hover:bg-primary-hover text-white uppercase tracking-wide text-sm rounded-full px-6 sm:px-8 py-3 transition-colors"
                            >
                                {t("coursePage.enrollBtn")}
                            </button>
                            <div>
                                <p className="font-medium">{t("coursePage.price")}</p>
                                <p className="text-xs text-text/50">{t("coursePage.priceNote")}</p>
                            </div>
                        </div>
                    </div>

                    {/* правая колонка — видео-плашка */}
                    <div className="flex flex-col gap-3">
                        <div>
                            <p className="text-center font-medium">{t("coursePage.videoTitle")}</p>
                            <p className="text-center text-sm text-text/50">
                                {t("coursePage.videoDescription")}
                            </p>
                        </div>
                        <button
                            type="button"
                            aria-label={t("coursePage.watchVideoAria")}
                            className="relative rounded-2xl bg-gray-300 aspect-video flex items-center justify-center overflow-hidden transition-transform hover:scale-[1.02]"
                        >
                            <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                                <img src={play} alt="" className="w-5 h-5 ml-0.5" />
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 md:px-24 pb-16 md:pb-24 max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-serif mb-8">{t("coursePage.modulesHeading")}</h2>
                <div>
                    {modules.map((module, index) => (
                        <AccordionItem
                            key={module.title}
                            module={module}
                            lessonsCount={MODULE_LESSON_COUNTS[index]}
                            lessonsLabel={lessonsLabel}
                            index={index}
                            isOpen={openIndex === index}
                            onToggle={handleToggle}
                        />
                    ))}
                </div>
            </section>
        </div>
    )
}
