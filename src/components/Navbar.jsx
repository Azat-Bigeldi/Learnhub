import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../i18n/useLanguage";

function navLinkClasses(isActive) {
    return [
        "no-underline hover:text-primary transition-colors duration-200 text-sm font-medium py-1 border-b-2",
        isActive
            ? "text-primary border-primary"
            : "text-text border-transparent",
    ].join(" ");
}

export default function Navbar() {
    const { t } = useLanguage();
    const location = useLocation();

    const isHome = location.pathname === "/";

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    /*
     * Навигация
     */
    const NAV_ITEMS = useMemo(
        () => [
            {
                id: "home",
                label: t("navbar.home"),
                type: "anchor",
            },
            {
                to: "/courses",
                label: t("navbar.courses"),
                type: "route",
            },
            {
                id: "teacher",
                label: t("navbar.teacher"),
                type: "anchor",
            },
            {
                id: "results",
                label: t("navbar.results"),
                type: "anchor",
            },
            {
                id: "faq",
                label: t("navbar.faq"),
                type: "anchor",
            },
        ],
        [t]
    );

    /*
     * Закрываем меню после навигации
     */
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname, location.hash]);

    /*
     * Запрещаем прокрутку страницы,
     * когда открыто мобильное меню
     */
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    /*
     * Закрытие меню по Escape
     */
    useEffect(() => {
        if (!isMenuOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isMenuOpen]);

    /*
     * Определяем активную секцию на главной странице
     */
    useEffect(() => {
        if (!isHome) return;

        const ids = NAV_ITEMS
            .filter((item) => item.type === "anchor")
            .map((item) => item.id);

        const sections = ids
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            b.intersectionRatio - a.intersectionRatio
                    );

                if (visible[0]) {
                    setActiveSection(visible[0].target.id);
                }
            },
            {
                rootMargin: "-45% 0px -45% 0px",
                threshold: [0, 0.25, 0.5, 0.75, 1],
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [isHome, NAV_ITEMS]);

    /*
     * Рендер отдельного пункта меню
     */
    const renderNavItem = (item, onNavigate) => {
        if (item.type === "route") {
            return (
                <NavLink
                    key={item.id || item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                        navLinkClasses(isActive)
                    }
                >
                    {item.label}
                </NavLink>
            );
        }

        const isActive =
            isHome && activeSection === item.id;

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
        <>
            {/* =====================================================
                DESKTOP / MAIN NAVBAR
            ====================================================== */}

            <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur border-b border-black/5">
                <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-primary font-bold no-underline hover:underline italic text-lg shrink-0"
                    >
                        AtokSchool
                    </Link>

                    {/* =================================================
                        DESKTOP NAVIGATION
                    ================================================== */}

                    <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                        {NAV_ITEMS.map((item) =>
                            renderNavItem(item)
                        )}
                    </nav>

                    {/* =================================================
                        DESKTOP ACTIONS
                    ================================================== */}

                    <div className="hidden lg:flex items-center gap-4">
                        <LanguageSwitcher variant="desktop" />

                        <Link
                            to="/register"
                            className="bg-primary hover:bg-primary-hover text-white tracking-wide px-6 py-2 rounded-full no-underline transition-colors"
                        >
                            {t("navbar.login")}
                        </Link>
                    </div>

                    {/* =================================================
                        MOBILE BURGER
                    ================================================== */}

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
            </header>

            {/* =====================================================
                MOBILE OVERLAY
                Затемняет весь сайт позади sidebar
            ====================================================== */}

            <div
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
                className={`
                    fixed inset-0
                    z-[60]
                    bg-black/50
                    backdrop-blur-[2px]
                    transition-opacity
                    duration-300
                    lg:hidden
                    ${
                        isMenuOpen
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                    }
                `}
            />

            {/* =====================================================
                MOBILE SIDEBAR
            ====================================================== */}

            <aside
                role="dialog"
                aria-modal="true"
                aria-label={t("navbar.openMenu")}
                className={`
                    fixed
                    top-0
                    right-0
                    z-[70]

                    h-dvh
                    w-[88vw]
                    max-w-[400px]

                    bg-white
                    shadow-2xl

                    overflow-y-auto

                    transition-transform
                    duration-300
                    ease-out

                    lg:hidden

                    ${
                        isMenuOpen
                            ? "translate-x-0"
                            : "translate-x-full"
                    }
                `}
            >
                {/* =================================================
                    SIDEBAR HEADER
                ================================================== */}

                <div className="flex items-center justify-between px-5 sm:px-6 h-16 md:h-20 border-b border-black/5">

                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-primary font-bold italic text-lg no-underline"
                    >
                        AtokSchool
                    </Link>

                    {/* Close button */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label={t("navbar.closeMenu")}
                        className="
                            w-10
                            h-10
                            flex
                            items-center
                            justify-center
                            rounded-full
                            hover:bg-black/5
                            active:bg-black/10
                            transition-colors
                        "
                    >
                        <svg
                            className="w-6 h-6 text-text"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* =================================================
                    SIDEBAR NAVIGATION
                ================================================== */}

                <nav className="flex flex-col px-5 sm:px-6 py-5">

                    {NAV_ITEMS.map((item) => (
                        <div
                            key={item.id || item.to}
                            className="
                                py-3.5
                                border-b
                                border-black/5
                                last:border-b-0
                            "
                        >
                            {renderNavItem(item, () =>
                                setIsMenuOpen(false)
                            )}
                        </div>
                    ))}
                </nav>

                {/* =================================================
                    SIDEBAR ACTIONS
                ================================================== */}

                <div className="px-5 sm:px-6 mt-2 pb-8">

                    <div className="flex flex-col gap-4">

                        {/* Language */}
                        <LanguageSwitcher variant="mobile" />

                        {/* Login */}
                        <Link
                            to="/register"
                            onClick={() =>
                                setIsMenuOpen(false)
                            }
                            className="
                                w-full
                                text-center
                                bg-primary
                                hover:bg-primary-hover
                                text-white
                                tracking-wide
                                px-6
                                py-3
                                rounded-full
                                no-underline
                                transition-colors
                            "
                        >
                            {t("navbar.login")}
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}