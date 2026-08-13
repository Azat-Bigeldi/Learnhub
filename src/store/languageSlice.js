import { createSlice } from '@reduxjs/toolkit';

export const LANGUAGE_STORAGE_KEY = 'atokschool_language';
export const SUPPORTED_LANGUAGES = ['ru', 'kz'];
export const DEFAULT_LANGUAGE = 'ru';

// Читаем сохранённый ранее язык из localStorage при инициализации стора —
// так выбор языка переживает обновление страницы и переход между маршрутами.
function readLanguageFromStorage() {
    try {
        const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (saved && SUPPORTED_LANGUAGES.includes(saved)) return saved;
    } catch {
        // localStorage может быть недоступен (приватный режим и т.п.) —
        // в этом случае просто используем язык по умолчанию.
    }
    return DEFAULT_LANGUAGE;
}

const languageSlice = createSlice({
    name: 'language',

    initialState: {
        current: readLanguageFromStorage(),
    },

    reducers: {
        setLanguage: (state, action) => {
            if (SUPPORTED_LANGUAGES.includes(action.payload)) {
                state.current = action.payload;
            }
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export const selectLanguage = (reduxState) => reduxState.language.current;
export default languageSlice.reducer;
