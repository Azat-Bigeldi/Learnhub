import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/useLanguage";

// Названия языков в переключателе всегда показываются на «родном» для них
// языке (RU — Русский, KZ — Қазақша), независимо от того, какой язык сейчас
// выбран в интерфейсе — так делают почти все языковые переключатели.
const LANGUAGE_OPTIONS = [
    { code: "ru", label: "RU — Русский" },
    { code: "kz", label: "KZ — Қазақша" },
];

export default function LanguageSwitcher({ variant = "desktop" }) {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef(null);

    // Закрываем выпадающий список при клике вне переключателя.
    useEffect(() => {
        if (!isOpen) return undefined;
        function handleClickOutside(event) {
            if (rootRef.current && !rootRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleSelect = (code) => {
        setLanguage(code);
        setIsOpen(false);
    };

    const isMobile = variant === "mobile";

    return (
        <div ref={rootRef} className={`relative ${isMobile ? "w-full" : ""}`}>
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className={`flex items-center gap-1.5 text-text text-sm font-medium px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors ${
                    isMobile ? "w-full justify-center" : ""
                }`}
            >
                {language.toUpperCase()}
                <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <ul
                    role="listbox"
                    className={`absolute z-50 mt-2 min-w-[9.5rem] bg-white border border-gray-200 rounded-xl shadow-lg py-1 ${
                        isMobile ? "left-0 right-0" : "right-0"
                    }`}
                >
                    {LANGUAGE_OPTIONS.map((option) => (
                        <li key={option.code}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={language === option.code}
                                onClick={() => handleSelect(option.code)}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-bgo ${
                                    language === option.code ? "text-primary font-medium" : "text-text"
                                }`}
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
