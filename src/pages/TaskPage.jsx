import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useLanguage } from "../i18n/useLanguage";
import { PRACTICE_TASK_COUNT, buildPracticeTasks } from "../utils/practiceTasks";
import { buildQuizQuestion } from "../utils/buildQuizQuestion";

// Страница теста по одной практической задаче: вопрос и варианты ответа —
// как в гугл-тестах, снизу — навигация между задачами (назад/вперёд и точки
// прогресса). Переключение задачи меняет только сам вопрос: маршрут, шапка
// и нижняя навигация остаются смонтированными, обновляется лишь блок с
// вопросом и ответами (state ответа сбрасывается через useEffect по taskIndex).
export default function TaskPage() {
    const { t } = useLanguage();
    const params = useParams();
    const moduleIndex = Number(params.moduleIndex);
    const topicIndex = Number(params.topicIndex);
    const taskIndex = Number(params.taskIndex);

    const modules = t("coursePage.modules");
    const currentModule = modules[moduleIndex];
    const currentTopic = currentModule?.topics?.[topicIndex];

    const [selectedOption, setSelectedOption] = useState(null);
    const [hasChecked, setHasChecked] = useState(false);

    // Смена задачи (даже в рамках той же темы) сбрасывает выбранный ответ —
    // остальная разметка страницы (шапка, нижняя навигация) не перемонтируется.
    useEffect(() => {
        setSelectedOption(null);
        setHasChecked(false);
    }, [taskIndex]);

    const practiceTasks = currentTopic ? buildPracticeTasks(t, currentTopic.title) : [];
    const currentTask = practiceTasks[taskIndex];

    useDocumentTitle(currentTask?.title ?? t("meta.courses"));

    const isValidRoute = Boolean(
        currentModule && currentTopic &&
        !Number.isNaN(moduleIndex) && !Number.isNaN(topicIndex) && !Number.isNaN(taskIndex) &&
        taskIndex >= 0 && taskIndex < PRACTICE_TASK_COUNT
    );

    if (!isValidRoute) {
        return <Navigate to="/courses" replace />;
    }

    const quiz = buildQuizQuestion(t, currentTopic.title, taskIndex + 1);
    const isCorrect = selectedOption === quiz.correctIndex;
    const hasPrev = taskIndex > 0;
    const hasNext = taskIndex < PRACTICE_TASK_COUNT - 1;
    const lessonPath = `/courses/lesson/${moduleIndex}/${topicIndex}`;
    const taskPath = (index) => `/courses/lesson/${moduleIndex}/${topicIndex}/task/${index}`;

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
            <header className="flex items-center justify-between px-4 sm:px-6 h-14 border-b border-white/10 shrink-0">
                <Link to="/" className="text-white font-bold no-underline hover:underline italic">
                    AtokSchool
                </Link>
                <Link
                    to={lessonPath}
                    className="text-sm text-white/70 hover:text-white no-underline flex items-center gap-1.5"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t("lessonPage.backToLesson")}
                </Link>
            </header>

            <div className="flex-1 bg-bg text-text flex flex-col items-center px-4 sm:px-6 py-10 sm:py-16">
                <div className="w-full max-w-2xl">
                    <p className="text-xs uppercase tracking-wide text-text/40 mb-2">{currentTopic.title}</p>
                    <p className="text-sm text-text/50 mb-6">
                        {t("lessonPage.taskProgressLabel", { current: taskIndex + 1, total: PRACTICE_TASK_COUNT })}
                    </p>

                    {/* Блок вопроса и ответов — единственное, что обновляется
                        при переключении между задачами. */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
                        <h1 className="text-xl sm:text-2xl font-serif mb-6">{quiz.question}</h1>

                        <div className="flex flex-col gap-3">
                            {quiz.options.map((option, index) => {
                                const isSelected = selectedOption === index;
                                const isRightAnswer = hasChecked && index === quiz.correctIndex;
                                const isWrongSelected = hasChecked && isSelected && index !== quiz.correctIndex;

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => !hasChecked && setSelectedOption(index)}
                                        disabled={hasChecked}
                                        aria-pressed={isSelected}
                                        className={`flex items-center gap-3 text-left rounded-xl border px-4 py-3 transition-colors ${
                                            isRightAnswer
                                                ? "border-green-500 bg-green-50"
                                                : isWrongSelected
                                                ? "border-red-400 bg-red-50"
                                                : isSelected
                                                ? "border-primary bg-primary/5"
                                                : "border-gray-200 hover:border-primary/50"
                                        }`}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                isSelected ? "border-primary" : "border-gray-300"
                                            }`}
                                        >
                                            {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                        </span>
                                        <span className="text-sm sm:text-base text-text">{option}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {!hasChecked ? (
                            <button
                                type="button"
                                onClick={() => setHasChecked(true)}
                                disabled={selectedOption === null}
                                className="mt-6 bg-primary hover:bg-primary-hover disabled:opacity-40 text-white uppercase tracking-wide text-sm rounded-full px-6 py-3 transition-colors"
                            >
                                {t("lessonPage.checkAnswerBtn")}
                            </button>
                        ) : (
                            <p className={`mt-6 text-sm font-medium ${isCorrect ? "text-green-600" : "text-red-500"}`} role="status">
                                {isCorrect ? t("lessonPage.correctAnswerMessage") : t("lessonPage.incorrectAnswerMessage")}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Навигация между задачами */}
            <div className="bg-[#0f0f0f] border-t border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between gap-3 shrink-0">
                {hasPrev ? (
                    <Link
                        to={taskPath(taskIndex - 1)}
                        className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white no-underline"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="hidden sm:inline">{t("lessonPage.prevTaskBtn")}</span>
                    </Link>
                ) : <span />}

                <div className="hidden sm:flex items-center gap-1.5">
                    {practiceTasks.map((task, index) => (
                        <Link
                            key={task.title}
                            to={taskPath(index)}
                            aria-label={task.title}
                            aria-current={index === taskIndex ? "step" : undefined}
                            className={`h-2 rounded-full transition-all ${
                                index === taskIndex ? "bg-primary w-6" : "bg-white/20 hover:bg-white/40 w-2"
                            }`}
                        />
                    ))}
                </div>

                {hasNext ? (
                    <Link
                        to={taskPath(taskIndex + 1)}
                        className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white no-underline"
                    >
                        <span className="hidden sm:inline">{t("lessonPage.nextTaskBtn")}</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                ) : (
                    <Link
                        to={lessonPath}
                        className="flex items-center gap-1.5 text-sm bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full no-underline transition-colors"
                    >
                        {t("lessonPage.finishTestBtn")}
                    </Link>
                )}
            </div>
        </div>
    );
}
