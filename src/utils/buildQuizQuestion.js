// Генерирует тестовый вопрос-заглушку с вариантами ответа для конкретной
// задачи. Контент демонстрационный (как и сами практические задачи) —
// реальные вопросы и формулы можно будет подставить сюда позже, структура
// компонента от этого не изменится.
const OPTION_LETTERS = ["A", "B", "C", "D"];

export function buildQuizQuestion(t, topicTitle, taskNumber) {
    return {
        question: t("lessonPage.quizQuestionTemplate", { number: taskNumber, topic: topicTitle }),
        options: OPTION_LETTERS.map((letter) => t("lessonPage.quizOptionTemplate", { letter })),
        correctIndex: 0,
    };
}
