import { configureStore } from "@reduxjs/toolkit";
import { useDispatch , useSelector } from "react-redux";
import authSliceReducer from './Authslice.js';
import notificationSliceReducer from './notificationSlice.js';
import languageSliceReducer, { selectLanguage, LANGUAGE_STORAGE_KEY } from './languageSlice.js';

const reduxStore = configureStore({
    reducer: {
        auth: authSliceReducer,
        notifications: notificationSliceReducer,
        language: languageSliceReducer,
    },
});

// Язык хранится в Redux вместе с остальным глобальным состоянием, но у него
// есть два побочных эффекта вне React-дерева: сохранение в localStorage (чтобы
// выбор пережил перезагрузку страницы) и атрибут <html lang> (для доступности
// и корректной работы браузерных инструментов вроде проверки орфографии).
// Синхронизируем их через подписку на стор, а не в самом редьюсере — редьюсеры
// должны оставаться чистыми функциями без побочных эффектов.
function syncLanguageSideEffects(language) {
    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
        // localStorage недоступен — просто не сохраняем выбор между визитами.
    }
    document.documentElement.lang = language === 'kz' ? 'kk' : 'ru';
}

let previousLanguage;
reduxStore.subscribe(() => {
    const language = selectLanguage(reduxStore.getState());
    if (language === previousLanguage) return;
    previousLanguage = language;
    syncLanguageSideEffects(language);
});
// Применяем сохранённый язык сразу при старте приложения, до первого рендера.
syncLanguageSideEffects(selectLanguage(reduxStore.getState()));

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
export default reduxStore;
