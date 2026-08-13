import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import play from "../imgsourse/play.png";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useLanguage } from "../i18n/useLanguage";
import { TOPIC_DURATIONS } from "../data/topicDurations";
import { buildPracticeTasks } from "../utils/practiceTasks";
import TaskNumberAccordion from "../components/TaskNumberAccordion";

const COMPLETED_STORAGE_KEY = "atokschool_completed_lessons";

function readCompletedFromStorage() {
    try {
        const raw = localStorage.getItem(COMPLETED_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
        // localStorage недоступен или данные повреждены — начинаем с чистого состояния.
        return new Set();
    }
}

function countCompletedInModule(completedSet, moduleIndex, topicCount) {
    let count = 0;
    for (let i = 0; i < topicCount; i += 1) {
        if (completedSet.has(`${moduleIndex}-${i}`)) count += 1;
    }
    return count;
}

function sumDurations(durations) {
    return durations.reduce((total, minutes) => total + minutes, 0);
}

function ChevronIcon({ isOpen }) {
    return (
        <svg
            className={`w-5 h-5 text-text/50 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
}

export default function LessonPage() {
    const { t } = useLanguage();
    const params = useParams();
    const moduleIndex = Number(params.moduleIndex);
    const topicIndex = Number(params.topicIndex);

    const modules = t("coursePage.modules");
    const currentModule = modules[moduleIndex];
    const currentTopic = currentModule?.topics?.[topicIndex];

    const [completedSet, setCompletedSet] = useState(readCompletedFromStorage);
    // Программа курса теперь отдельная выезжающая панель, а не постоянная
    // колонка — по умолчанию закрыта.
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // Внутри панели по умолчанию раскрыт раздел, к которому относится
    // текущая тема — как в реальных плеерах курсов.
    const [openModuleIndex, setOpenModuleIndex] = useState(moduleIndex);

    useEffect(() => {
        setOpenModuleIndex(moduleIndex);
    }, [moduleIndex]);

    useEffect(() => {
        try {
            localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(Array.from(completedSet)));
        } catch {
            // localStorage недоступен — прогресс просто не переживёт перезагрузку.
        }
    }, [completedSet]);

    // Закрытие панели по Esc — стандартное поведение для выезжающих панелей.
    useEffect(() => {
        if (!isDrawerOpen) return undefined;
        function handleKeyDown(event) {
            if (event.key === "Escape") setIsDrawerOpen(false);
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isDrawerOpen]);

    // Блокируем прокрутку фона, пока панель открыта — работает и на мобильных,
    // где панель занимает весь экран.
    useEffect(() => {
        document.body.style.overflow = isDrawerOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isDrawerOpen]);

    useDocumentTitle(currentTopic?.title ?? t("meta.courses"));

    const toggleCompleted = (key) => {
        setCompletedSet((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const toggleModuleOpen = (index) => {
        setOpenModuleIndex((prev) => (prev === index ? null : index));
    };

    if (!currentModule || !currentTopic || Number.isNaN(moduleIndex) || Number.isNaN(topicIndex)) {
        return <Navigate to="/courses" replace />;
    }

    const minutesLabel = t("lessonPage.minutesShort");
    const practiceTasks = buildPracticeTasks(t, currentTopic.title);

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
            <header className="flex items-center justify-between px-4 sm:px-6 h-14 border-b border-white/10 shrink-0">
                <Link to="/" className="text-white font-bold no-underline hover:underline italic">
                    AtokSchool
                </Link>
                <div className="flex items-center gap-3 sm:gap-5">
                    <Link
                        to="/courses"
                        className="text-sm text-white/70 hover:text-white no-underline flex items-center gap-1.5"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="hidden sm:inline">{t("lessonPage.backToCourse")}</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen(true)}
                        aria-haspopup="dialog"
                        aria-expanded={isDrawerOpen}
                        className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 py-1.5 rounded-full transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        {t("lessonPage.courseContentHeading")}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row">
                {/* Видео и описание темы */}
                <div className="flex-1 min-w-0 flex flex-col">
                    <button
                        type="button"
                        aria-label={t("lessonPage.watchVideoAria", { title: currentTopic.title })}
                        className="relative w-full aspect-video bg-[#1a1a1a] flex items-center justify-center shrink-0"
                    >
                        <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                            <img src={play} alt="" className="w-6 h-6 ml-0.5" />
                        </span>
                    </button>

                    <div className="bg-bg text-text px-4 sm:px-8 py-6 sm:py-8">
                        <p className="text-xs uppercase tracking-wide text-text/40 mb-2">
                            {currentModule.title}
                        </p>
                        <h1 className="text-2xl sm:text-3xl font-serif mb-4">{currentTopic.title}</h1>
                        <p className="text-text/70 leading-relaxed max-w-2xl">{currentTopic.description}</p>
                    </div>
                </div>

                {/* Задачи по теме — основной контент справа от видео.
                    Клик по номеру открывает отдельную страницу с тестом. */}
                <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 bg-bg text-text border-t lg:border-t-0 lg:border-l border-gray-200 px-4 sm:px-6 py-6 lg:max-h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:sticky lg:top-14">
                    <TaskNumberAccordion
                        tasks={practiceTasks}
                        heading={t("coursePage.tasksHeading")}
                        layout="grid"
                        linkBuilder={(taskIndex) => `/courses/lesson/${moduleIndex}/${topicIndex}/task/${taskIndex}`}
                    />
                </div>
            </div>

            {/* Затемнение фона под выезжающей панелью */}
            <div
                onClick={() => setIsDrawerOpen(false)}
                aria-hidden="true"
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
                    isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />

            {/* Выезжающая панель — программа курса. На мобильных занимает весь
                экран, на десктопе — фиксированной ширины справа. */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-label={t("lessonPage.courseContentHeading")}
                className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white text-text shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${
                    isDrawerOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="font-semibold">{t("lessonPage.courseContentHeading")}</h2>
                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen(false)}
                        aria-label={t("common.close")}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5 text-text/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {modules.map((module, mIndex) => {
                    const isSectionOpen = openModuleIndex === mIndex;
                    const moduleDurations = TOPIC_DURATIONS[mIndex] || [];
                    const completedCount = countCompletedInModule(completedSet, mIndex, module.topics.length);

                    return (
                        <div key={module.title} className="border-b border-gray-200">
                            <button
                                type="button"
                                onClick={() => toggleModuleOpen(mIndex)}
                                aria-expanded={isSectionOpen}
                                aria-label={isSectionOpen ? t("lessonPage.collapseSectionAria") : t("lessonPage.expandSectionAria")}
                                className="w-full flex items-start justify-between gap-3 px-4 sm:px-6 py-4 text-left"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-text">
                                        {t("lessonPage.moduleLabel", { number: mIndex + 1 })}: {module.title}
                                    </p>
                                    <p className="text-xs text-text/50 mt-1">
                                        {completedCount} / {module.topics.length} · {sumDurations(moduleDurations)} {minutesLabel}
                                    </p>
                                </div>
                                <ChevronIcon isOpen={isSectionOpen} />
                            </button>

                            {isSectionOpen && (
                                <div className="pb-2">
                                    {module.topics.map((topic, tIndex) => {
                                        const isActive = mIndex === moduleIndex && tIndex === topicIndex;
                                        const key = `${mIndex}-${tIndex}`;
                                        const isCompleted = completedSet.has(key);

                                        return (
                                            <div
                                                key={topic.title}
                                                className={`flex items-start gap-3 px-4 sm:px-6 py-3 transition-colors ${
                                                    isActive ? "bg-bgo" : "hover:bg-gray-50"
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCompleted(key)}
                                                    aria-label={t("lessonPage.completedCheckboxAria")}
                                                    aria-pressed={isCompleted}
                                                    className={`shrink-0 mt-0.5 w-5 h-5 rounded border flex items-center justify-center text-[11px] font-bold transition-colors ${
                                                        isCompleted
                                                            ? "bg-primary border-primary text-white"
                                                            : "border-gray-300 text-transparent"
                                                    }`}
                                                >
                                                    ✓
                                                </button>
                                                <Link
                                                    to={`/courses/lesson/${mIndex}/${tIndex}`}
                                                    onClick={() => setIsDrawerOpen(false)}
                                                    className="flex-1 no-underline"
                                                >
                                                    <p className={`text-sm ${isActive ? "text-primary font-medium" : "text-text"}`}>
                                                        {topic.title}
                                                    </p>
                                                    <p className="text-xs text-text/40 mt-0.5">
                                                        {(TOPIC_DURATIONS[mIndex] || [])[tIndex] ?? "—"} {minutesLabel}
                                                    </p>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </aside>
        </div>
    );
}
