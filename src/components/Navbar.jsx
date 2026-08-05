import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

// Пункты с id ведут на секции главной страницы (плавный скролл по якорю),
// пункты с to — на отдельные страницы через роутер.
const NAV_ITEMS = [
    { id: "home", label: "Главная", type: "anchor" },
    { to: "/courses", label: "Курс", type: "route" },
    { id: "teacher", label: "Учитель", type: "anchor" },
    { id: "results", label: "Результаты", type: "anchor" },
    { id: "faq", label: "Вопросы", type: "anchor" },
];

function navLinkClasses(isActive) {
    return [
        "no-underline hover:text-primary transition-colors duration-200 text-sm font-medium py-1 border-b-2",
        isActive ? "text-primary border-primary" : "text-text border-transparent",
    ].join(" ");
}

export default function Navbar() {
    const location = useLocation();
    const isHome = location.pathname === "/";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    // Закрываем мобильное меню при любой навигации (смена страницы или якоря)
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname, location.hash]);

    // Блокируем прокрутку фона, пока открыто мобильное меню
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
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
    }, [isHome]);

    const renderNavItem = (item, onNavigate) => {
        if (item.type === "route") {
            return (
                <NavLink
                    key={item.label}
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
                key={item.label}
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
                    <button
                        type="button"
                        className="text-text text-sm px-2 hover:text-primary transition-colors"
                    >
                        RU
                    </button>
                    <Link
                        to="/register"
                        className="bg-primary hover:bg-primary-hover text-white tracking-wide px-6 py-2 rounded-full no-underline transition-colors"
                    >
                        Войти
                    </Link>
                </div>

                {/* Бургер-кнопка — мобильные/планшет */}
                <button
                    type="button"
                    className="lg:hidden relative w-10 h-10 flex items-center justify-center shrink-0"
                    aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu"
                    onClick={() => setIsMenuOpen((open) => !open)}
                >
                    <span
                        className={`absolute block h-0.5 w-6 bg-text rounded-full transition-transform duration-300 ${
                            isMenuOpen ? "rotate-45" : "-translate-y-2"
                        }`}
                    />
                    <span
                        className={`absolute block h-0.5 w-6 bg-text rounded-full transition-opacity duration-200 ${
                            isMenuOpen ? "opacity-0" : "opacity-100"
                        }`}
                    />
                    <span
                        className={`absolute block h-0.5 w-6 bg-text rounded-full transition-transform duration-300 ${
                            isMenuOpen ? "-rotate-45" : "translate-y-2"
                        }`}
                    />
                </button>
            </div>

            {/* Навигация — мобильное выпадающее меню */}
            <div
                id="mobile-menu"
                className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                    isMenuOpen ? "max-h-[28rem]" : "max-h-0"
                }`}
            >
                <nav className="flex flex-col gap-1 px-4 sm:px-6 pb-6 pt-2 bg-bg border-b border-black/5">
                    {NAV_ITEMS.map((item) => (
                        <div key={item.label} className="py-2 border-b border-black/5 last:border-b-0">
                            {renderNavItem(item, () => setIsMenuOpen(false))}
                        </div>
                    ))}
                    <div className="flex items-center gap-4 pt-4 mt-2">
                        <button type="button" className="text-text text-sm px-2 hover:text-primary transition-colors">
                            RU
                        </button>
                        <Link
                            to="/register"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex-1 text-center bg-primary hover:bg-primary-hover text-white tracking-wide px-6 py-2.5 rounded-full no-underline transition-colors"
                        >
                            Войти
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
