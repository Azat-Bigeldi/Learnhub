import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { useAppSelector } from './store';
import { selectCurrentUser, selectIsAdmin } from './store/Authslice';
import useAuthSession from './hooks/useAuthSession';
import { useLanguage } from './i18n/useLanguage';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastContainer from "./components/ToastContainer";
import ErrorBoundary from "./components/ErrorBoundary";
import Main from "./pages/Main";

// Второстепенные страницы грузятся лениво отдельными чанками — уменьшает
// вес начального бандла для главной страницы (самой посещаемой).
const AuthPage = lazy(() => import("./pages/AuthPage"));
const CoursePage = lazy(() => import("./pages/CoursePage"));
const LessonPage = lazy(() => import("./pages/LessonPage"));
const TaskPage = lazy(() => import("./pages/TaskPage"));
const AnswerPage = lazy(() => import("./pages/AnswerPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteFallback() {
    const { t } = useLanguage();
    return (
        <div className="min-h-[50vh] flex items-center justify-center text-text/50 text-sm">
            {t("common.loading")}
        </div>
    );
}

// Компонент-страж: пускает на защищённый маршрут только авторизованных
// пользователей, иначе отправляет на /auth и запоминает, откуда пришли,
// чтобы после входа можно было вернуть пользователя обратно.
// requireAdmin — дополнительно требует роль администратора (проверяется на
// клиенте для UX, но реальная защита данных — RLS-политики в Supabase).
function PrivateRoute({ children, requireAdmin = false }) {
    const user = useAppSelector(selectCurrentUser);
    const isAdmin = useAppSelector(selectIsAdmin);
    const location = useLocation();
    if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
    if (requireAdmin && !isAdmin) return <Navigate to="/courses" replace />;
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
    const location = useLocation();
    // Страница урока — полноэкранный плеер (видео + программа курса) без
    // общего сайтового хедера и футера, как в реальных LMS-плеерах.
    const isImmersiveLessonPage = location.pathname.startsWith("/courses/lesson/");

    return (
        <>
            {!isImmersiveLessonPage && <Navbar />}
            <ScrollManager />
            <ToastContainer />
            <main>
                <Suspense fallback={<RouteFallback />}>
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/auth" element={<AuthPage initialTab="login" />} />
                        <Route path="/register" element={<AuthPage initialTab="register" />} />
                        <Route path="/courses" element={<CoursePage />} />
                        <Route path="/courses/lesson/:moduleIndex/:topicIndex" element={<LessonPage />} />
                        <Route path="/courses/lesson/:moduleIndex/:topicIndex/task/:taskIndex" element={<TaskPage />} />
                        <Route path="/courses/lesson/:moduleIndex/:topicIndex/answer" element={<AnswerPage />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        {/* Админ-панель: список всех зарегистрированных пользователей и
                            управление доступом к курсу. Доступна только пользователям
                            с ролью admin в таблице profiles (см. supabase/001_profiles_and_access.sql). */}
                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute requireAdmin>
                                    <AdminPage />
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </main>
            {!isImmersiveLessonPage && <Footer />}
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
