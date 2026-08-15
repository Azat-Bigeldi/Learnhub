import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../i18n/useLanguage";
import { useAppSelector } from "../store";
import { selectIsAdmin } from "../store/Authslice";

function navLinkClasses(isActive) {
    return [
        "no-underline hover:text-primary transition-colors duration-200 text-sm font-medium py-1 border-b-2",
        isActive ? "text-primary border-primary" : "text-text border-transparent",
    ].join(" ");
}

export default function Navbar() {
    const { t } = useLanguage();
    const location = useLocation();
    const isHome = location.pathname === "/";
    const isAdmin = useAppSelector(selectIsAdmin);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    // Пункты с id ведут на секции главной страницы (плавный скролл по якорю),
    // пункты с to — на отдельные страницы через роутер. Пересчитываем при
    // смене языка, чтобы подписи всегда были на актуальном языке.
    // Пункт «Админ-панель» показывается только пользователям с ролью admin.
    const NAV_ITEMS = useMemo(
        () => [
            { id: "home", label: t("navbar.home"), type: "anchor" },
            { to: "/courses", label: t("navbar.courses"), type: "route" },
            { id: "teacher", label: t("navbar.teacher"), type: "anchor" },
            { id: "results", label: t("navbar.results"), type: "anchor" },
            { id: "faq", label: t("navbar.faq"), type: "anchor" },
            ...(isAdmin ? [{ to: "/admin", label: t("navbar.admin"), type: "route" }] : []),
        ],
        [t, isAdmin]
    );

    // Закрываем мобильное меню при любой навигации (смена страницы или якоря)
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname, location.hash]);

    // Блокируем прокрутку фона, пока открыт сайдбар
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    // Закрытие по Esc — стандартное поведение для выезжающих панелей.
    useEffect(() => {
        if (!isMenuOpen) return undefined;
        function handleKeyDown(event) {
            if (event.key === "Escape") setIsMenuOpen(false);
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isMenuOpen]);

    // Подсвечиваем пункт меню, соответствующий секции, видимой во вьюпорте.
    // Работает только на главной странице, где эти секции существуют.
    useEffect(() => {
        if (!isHome) return undefined;

        const ids = NAV_ITEMS.filter((item) => item.type === "anchor").map((item) => item.id);
        const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
        if (sections.length === 0) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]) setActiveSection(visible[0].target.id);
            },
            { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [isHome, NAV_ITEMS]);

    const renderNavItem = (item, onNavigate) => {
        if (item.type === "route") {
            return (
                <NavLink
                    key={item.id || item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={({ isActive }) => navLinkClasses(isActive)}
                >
                    {item.label}
                </NavLink>
            );
        }
        const isActive = isHome && activeSection === item.id;
        return (
            <Link
                key={item.id || item.to}
                to={`/#${item.id}`}
                onClick={onNavigate}
                className={navLinkClasses(isActive)}
            >
                {item.label}
            </Link>
        );
    };

    return (
        <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur border-b border-black/5">
            <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
                <Link
                    to="/"
                    className="text-primary font-bold no-underline hover:underline italic text-lg shrink-0"
                >
                    AtokSchool
                </Link>

                {/* Навигация — десктоп */}
                <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                    {NAV_ITEMS.map((item) => renderNavItem(item))}
                </nav>

                <div className="hidden lg:flex items-center gap-4">
                    <LanguageSwitcher variant="desktop" />
                    <Link
                        to="/register"
                        className="bg-primary hover:bg-primary-hover text-white tracking-wide px-6 py-2 rounded-full no-underline transition-colors"
                    >
                        {t("navbar.login")}
                    </Link>
                </div>

                {/* Бургер-кнопка — мобильные/планшет, открывает сайдбар справа */}
                <button
                    type="button"
                    className="lg:hidden relative w-10 h-10 flex items-center justify-center shrink-0"
                    aria-label={t("navbar.openMenu")}
                    aria-haspopup="dialog"
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen(true)}
                >
                    <span className="absolute block h-0.5 w-6 bg-text rounded-full -translate-y-2" />
                    <span className="absolute block h-0.5 w-6 bg-text rounded-full" />
                    <span className="absolute block h-0.5 w-6 bg-text rounded-full translate-y-2" />
                </button>
            </div>

            {/* Затемнение фона под выезжающим сайдбаром. Рендерим только когда
                меню открыто (а не всегда с opacity-0) — так надёжнее: не нужно
                полагаться на то, что "невидимый" full-screen div с opacity-0
                и pointer-events-none корректно проигнорируется браузером. */}
            {isMenuOpen && (
                <div
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                    className="fixed inset-0 z-40 lg:hidden"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                />
            )}

            {/* Мобильное меню — выезжающий сайдбар справа.
                Ключевые свойства (position, ширина, непрозрачный фон) заданы
                и через Tailwind, и продублированы инлайн-стилем — так панель
                не сломается даже если конкретный класс по какой-то причине
                не попадёт в собранный CSS (устаревший кеш сборки и т.п.). */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-label={t("navbar.openMenu")}
                className={`fixed top-0 right-0 z-50 h-full shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
                style={{
                    width: "min(85vw, 320px)",
                    backgroundColor: "#FAF8F4",
                }}
            >
                <div className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-black/5">
                    <span className="text-primary font-bold italic">AtokSchool</span>
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label={t("navbar.closeMenu")}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                    >
                        <svg className="w-5 h-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex flex-col gap-1 px-4 sm:px-6 py-4">
                    {NAV_ITEMS.map((item) => (
                        <div key={item.id || item.to} className="py-2.5 border-b border-black/5 last:border-b-0">
                            {renderNavItem(item, () => setIsMenuOpen(false))}
                        </div>
                    ))}
                </nav>

                <div className="flex flex-col gap-3 px-4 sm:px-6 mt-2">
                    <LanguageSwitcher variant="mobile" />
                    <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-center bg-primary hover:bg-primary-hover text-white tracking-wide px-6 py-2.5 rounded-full no-underline transition-colors"
                    >
                        {t("navbar.login")}
                    </Link>
                </div>
            </aside>
        </header>
    );
}
