// Десять практических задач-заглушек по конкретной теме. Общий помощник —
// используется и на странице урока (сетка номеров), и на странице задачи
// (заголовок вкладки, подписи в навигации).
export const PRACTICE_TASK_COUNT = 10;

export function buildPracticeTasks(t, topicTitle) {
    return Array.from({ length: PRACTICE_TASK_COUNT }, (_, i) => {
        const number = i + 1;
        return {
            title: t("lessonPage.taskLabel", { number }),
            description: t("lessonPage.taskDescriptionTemplate", { number, topic: topicTitle }),
        };
    });
}
