import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { selectLanguage, setLanguage as setLanguageAction, DEFAULT_LANGUAGE } from '../store/languageSlice';
import ru from './locales/ru';
import kz from './locales/kz';

const dictionaries = { ru, kz };

// Достаём значение по ключу вида "auth.errors.nameTooShort" из вложенного объекта.
function resolveKey(dictionary, key) {
    return key
        .split('.')
        .reduce((acc, part) => (acc && typeof acc === 'object' ? acc[part] : undefined), dictionary);
}

// Простая подстановка переменных вида {{name}} в строку перевода.
function interpolate(template, vars) {
    if (!vars) return template;
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name) => (
        Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
    ));
}

// Чистая функция перевода без хуков — нужна там, где нельзя вызвать хук
// (например, в classContainer-компонентах вроде ErrorBoundary, которые
// получают язык через connect() из react-redux, а не через useSelector).
export function translate(language, key, vars) {
    const dictionary = dictionaries[language] || dictionaries[DEFAULT_LANGUAGE];
    const fallbackDictionary = dictionaries[DEFAULT_LANGUAGE];
    const value = resolveKey(dictionary, key) ?? resolveKey(fallbackDictionary, key);

    if (value === undefined) {
        // Отсутствующий ключ не должен ронять приложение — показываем сам
        // ключ, чтобы недостающий перевод было легко найти в интерфейсе.
        if (import.meta.env?.DEV) {
            console.warn(`[i18n] Нет перевода для ключа "${key}"`);
        }
        return key;
    }

    return typeof value === 'string' ? interpolate(value, vars) : value;
}

// Хук для функциональных компонентов. Язык хранится в Redux (store/languageSlice)
// вместе с остальным глобальным состоянием приложения (auth, notifications),
// поэтому здесь используются обычные useAppSelector/useAppDispatch.
export function useLanguage() {
    const language = useAppSelector(selectLanguage);
    const dispatch = useAppDispatch();

    const setLanguage = useCallback((lang) => {
        dispatch(setLanguageAction(lang));
    }, [dispatch]);

    const t = useCallback((key, vars) => translate(language, key, vars), [language]);

    return useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);
}
