import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { useAppSelector } from './store';
import { selectCurrentUser } from './store/authSlice';
import useAuthSession from './hooks/useAuthSession';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastContainer from "./components/ToastContainer";
import ErrorBoundary from "./components/ErrorBoundary";
import Main from "./pages/Main";

// Второстепенные страницы грузятся лениво отдельными чанками — уменьшает
// вес начального бандла для главной страницы (самой посещаемой).
const AuthPage = lazy(() => import("./pages/AuthPage"));
const CoursePage = lazy(() => import("./pages/CoursePage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteFallback() {
    return (
        <div className="min-h-[50vh] flex items-center justify-center text-text/50 text-sm">
            Загрузка...
        </div>
    );
}

// Компонент-страж: пускает на защищённый маршрут только авторизованных
// пользователей, иначе отправляет на /auth и запоминает, откуда пришли,
// чтобы после входа можно было вернуть пользователя обратно.
function PrivateRoute({ children }) {
    const user = useAppSelector(selectCurrentUser);
    const location = useLocation();
    if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
    return children;
}

// Синхронизирует Redux-сессию с Supabase один раз при монтировании дерева роутов.
function AuthSessionSync() {
    useAuthSession();
    return null;
}

// Управляет прокруткой при смене маршрута: если в URL есть якорь (#id),
// плавно скроллит к нужной секции (в т.ч. после перехода с другой страницы
// на главную), иначе возвращает страницу наверх — иначе при переходе между
// страницами сохранялась бы прежняя позиция скролла.
function ScrollManager() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.slice(1);
            // Ждём кадр отрисовки — секция может ещё не быть в DOM
            // (например, сразу после перехода с ленивой страницы на главную).
            const raf = requestAnimationFrame(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            return () => cancelAnimationFrame(raf);
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        return undefined;
    }, [location.pathname, location.hash]);

    return null;
}

function AppLayout() {
    return (
        <>
            <Navbar />
            <ScrollManager />
            <ToastContainer />
            <main>
                <Suspense fallback={<RouteFallback />}>
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/auth" element={<AuthPage initialTab="login" />} />
                        <Route path="/register" element={<AuthPage initialTab="register" />} />
                        <Route path="/courses" element={<CoursePage />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        {/* Пример защищённого маршрута — используем PrivateRoute, чтобы
                            компонент не оставался мёртвым кодом. Расширяйте по мере
                            появления страниц личного кабинета. */}
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <CoursePage />
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <AuthSessionSync />
                <AppLayout />
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
