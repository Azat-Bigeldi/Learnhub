import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../i18n/useLanguage";
import { useAppDispatch, useAppSelector } from "../store";
import { selectIsAdmin, selectIsLoggedIn, selectCurrentUser } from "../store/Authslice";
import { addNotification } from "../store/notificationSlice";
import { supabase } from "../lib/supabaseClient";

function navLinkClasses(isActive) {
    return [
        "no-underline hover:text-primary transition-colors duration-200 text-sm font-medium py-1 border-b-2",
        isActive ? "text-primary border-primary" : "text-text border-transparent",
    ].join(" ");
}

export default function Navbar() {
    const { t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isHome = location.pathname === "/";
    const isAdmin = useAppSelector(selectIsAdmin);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const currentUser = useAppSelector(selectCurrentUser);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        setIsMenuOpen(false);
        const { error } = await supabase.auth.signOut();
        setIsLoggingOut(false);

        if (error) {
            dispatch(addNotification({ message: error.message, type: "error" }));
            return;
        }
        // Само состояние (Redux + localStorage) обновится через подписку
        // onAuthStateChange в useAuthSession — здесь просто уведомляем
        // и уводим со страниц, требующих авторизации/доступа.
        dispatch(addNotification({ message: t("auth.notifications.loggedOut"), type: "success" }));
        navigate("/");
    };

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

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname, location.hash]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    useEffect(() => {
        if (!isMenuOpen) return undefined;
        function handleKeyDown(event) {
            if (event.key === "Escape") setIsMenuOpen(false);
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isMenuOpen]);

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
        // ВАЖНО: затемнение и выезжающая панель (fixed) вынесены за пределы
        // <header>. У <header> есть backdrop-blur (backdrop-filter), а по
        // CSS-спеке элемент с filter/backdrop-filter становится containing
        // block для всех своих потомков с position: fixed — из-за этого fixed
        // считался не от экрана, а от самого хедера, и панель "разваливалась"
        // по ширине/позиции. Держите backdrop-blur и fixed-элементы на разных
        // уровнях вложенности, а не внутри друг друга.
        <>
            <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur border-b border-black/5">
                <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
                    <Link
                        to="/"
                        className="text-primary font-bold no-underline hover:underline italic text-lg shrink-0"
                    >
                        AtokSchool
                    </Link>

                    <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                        {NAV_ITEMS.map((item) => renderNavItem(item))}
                    </nav>

                    <div className="hidden lg:flex items-center gap-4">
                        <LanguageSwitcher variant="desktop" />
                        {isLoggedIn ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                title={currentUser?.email}
                                className="border border-gray-300 hover:border-primary hover:text-primary text-text tracking-wide px-6 py-2 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {t("navbar.logout")}
                            </button>
                        ) : (
                            <Link
                                to="/register"
                                className="bg-primary hover:bg-primary-hover text-white tracking-wide px-6 py-2 rounded-full no-underline transition-colors"
                            >
                                {t("navbar.login")}
                            </Link>
                        )}
                    </div>

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

            {isMenuOpen && (
                <div
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                    className="fixed inset-0 z-40 lg:hidden"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                />
            )}

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
                    {isLoggedIn ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="text-center border border-gray-300 hover:border-primary hover:text-primary text-text tracking-wide px-6 py-2.5 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {t("navbar.logout")}
                        </button>
                    ) : (
                        <Link
                            to="/register"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-center bg-primary hover:bg-primary-hover text-white tracking-wide px-6 py-2.5 rounded-full no-underline transition-colors"
                        >
                            {t("navbar.login")}
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
}