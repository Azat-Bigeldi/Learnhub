// Отслеживает, какие практические задачи (тесты) пользователь уже решил
// правильно. Ключ — "moduleIndex-topicIndex-taskIndex". Используется, чтобы
// понять, когда все 10 задач по теме пройдены и можно открыть разбор решения.
const TASK_COMPLETION_STORAGE_KEY = "atokschool_completed_tasks";

export function taskKey(moduleIndex, topicIndex, taskIndex) {
    return `${moduleIndex}-${topicIndex}-${taskIndex}`;
}

export function readCompletedTasks() {
    try {
        const raw = localStorage.getItem(TASK_COMPLETION_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
        // localStorage недоступен или данные повреждены — начинаем с чистого состояния.
        return new Set();
    }
}

export function writeCompletedTasks(completedSet) {
    try {
        localStorage.setItem(TASK_COMPLETION_STORAGE_KEY, JSON.stringify(Array.from(completedSet)));
    } catch {
        // localStorage недоступен — прогресс просто не переживёт перезагрузку.
    }
}

export function markTaskCompleted(moduleIndex, topicIndex, taskIndex) {
    const key = taskKey(moduleIndex, topicIndex, taskIndex);
    const completed = readCompletedTasks();
    if (!completed.has(key)) {
        completed.add(key);
        writeCompletedTasks(completed);
    }
    return completed;
}

export function areAllTasksCompleted(completedSet, moduleIndex, topicIndex, taskCount) {
    for (let i = 0; i < taskCount; i += 1) {
        if (!completedSet.has(taskKey(moduleIndex, topicIndex, i))) return false;
    }
    return true;
}
