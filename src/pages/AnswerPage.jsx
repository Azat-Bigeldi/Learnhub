import { Link, Navigate, useParams } from "react-router-dom";
import play from "../imgsourse/play.png";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useLanguage } from "../i18n/useLanguage";
import { PRACTICE_TASK_COUNT } from "../utils/practiceTasks";
import { readCompletedTasks, areAllTasksCompleted } from "../utils/taskCompletion";

// Разбор решения по теме — просто видео, без заданий и сайдбара. Доступна
// только после того, как пройдены все 10 практических задач по теме: прямой
// переход по ссылке до этого момента отправляет обратно на страницу урока.
export default function AnswerPage() {
    const { t } = useLanguage();
    const params = useParams();
    const moduleIndex = Number(params.moduleIndex);
    const topicIndex = Number(params.topicIndex);

    const modules = t("coursePage.modules");
    const currentModule = modules[moduleIndex];
    const currentTopic = currentModule?.topics?.[topicIndex];

    useDocumentTitle(
        currentTopic ? t("lessonPage.answerPageTitle", { topic: currentTopic.title }) : t("meta.courses")
    );

    const isValidRoute = Boolean(
        currentModule && currentTopic && !Number.isNaN(moduleIndex) && !Number.isNaN(topicIndex)
    );
    const lessonPath = `/courses/lesson/${moduleIndex}/${topicIndex}`;

    if (!isValidRoute) {
        return <Navigate to="/courses" replace />;
    }

    const completedTasks = readCompletedTasks();
    const allTasksCompleted = areAllTasksCompleted(completedTasks, moduleIndex, topicIndex, PRACTICE_TASK_COUNT);

    if (!allTasksCompleted) {
        return <Navigate to={lessonPath} replace />;
    }

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

            <div className="flex-1 flex flex-col">
                <button
                    type="button"
                    aria-label={t("lessonPage.watchAnswerVideoAria", { title: currentTopic.title })}
                    className="relative w-full aspect-video bg-[#1a1a1a] flex items-center justify-center shrink-0"
                >
                    <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <img src={play} alt="" className="w-6 h-6 ml-0.5" />
                    </span>
                </button>

                <div className="bg-bg text-text px-4 sm:px-8 py-6 sm:py-8 flex-1">
                    <p className="text-xs uppercase tracking-wide text-text/40 mb-2">{currentModule.title}</p>
                    <h1 className="text-2xl sm:text-3xl font-serif mb-4">
                        {t("lessonPage.answerPageHeading", { topic: currentTopic.title })}
                    </h1>
                    <p className="text-text/70 leading-relaxed max-w-2xl">
                        {t("lessonPage.answerPageDescription")}
                    </p>
                </div>
            </div>
        </div>
    );
}
