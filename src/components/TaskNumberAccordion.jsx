import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/useLanguage";

// Пронумерованные пункты-ссылки. Два варианта раскладки:
//   layout="list" (по умолчанию) — вертикальный список со стрелкой;
//      используется для тем модуля на странице курса.
//   layout="grid" — квадратная цифровая сетка в духе клавиш калькулятора,
//      без подписи; используется для задач на странице урока — клик по
//      номеру открывает отдельную страницу с тестом по этой задаче.
//      trailingItem — необязательная дополнительная ячейка в конце сетки
//      (используется для разблокируемой ячейки «Ответ»).
export default function TaskNumberAccordion({ tasks, linkBuilder, heading, layout = "list", trailingItem }) {
    const { t } = useLanguage();
    // Защита от падения, если родитель забыл передать linkBuilder — вместо
    // краша рендерим ссылки на "#" (чтобы сразу было видно проблему в разметке,
    // а не белый экран с ошибкой).
    const buildLink = typeof linkBuilder === "function" ? linkBuilder : () => "#";

    const headingNode = heading !== false && (
        <p className="text-xs uppercase tracking-wide text-text/40 mb-1">
            {heading || t("coursePage.tasksHeading")}
        </p>
    );

    if (layout === "grid") {
        return (
            <div className="flex flex-col gap-3">
                {headingNode}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                    {tasks.map((task, index) => (
                        <Link
                            key={task.title}
                            to={buildLink(index)}
                            aria-label={`${t("coursePage.taskNumberAria", { number: index + 1 })}: ${task.title}`}
                            className="aspect-square rounded-xl border border-gray-300 bg-bgo text-text font-mono font-bold text-base sm:text-lg flex items-center justify-center no-underline transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                        >
                            {index + 1}
                        </Link>
                    ))}
                    {trailingItem}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {headingNode}
            {tasks.map((task, index) => (
                <Link
                    key={task.title}
                    to={buildLink(index)}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 no-underline transition-colors hover:border-primary hover:bg-primary/5"
                >
                    <span
                        aria-hidden="true"
                        className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm sm:text-base border border-gray-300 bg-bgo text-text"
                    >
                        {index + 1}
                    </span>
                    <span className="text-sm sm:text-base text-text flex-1">{task.title}</span>
                    <svg
                        className="w-4 h-4 text-text/30 shrink-0"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            ))}
        </div>
    );
}
