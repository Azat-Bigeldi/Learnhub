import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAppDispatch } from "../store"
import { setUser } from "../store/Authslice.js"
import { addNotification } from "../store/notificationSlice.js"
import { supabase } from "../lib/supabaseClient"
import useDocumentTitle from "../hooks/useDocumentTitle"
import Spinner from "../components/Spinner"
import { useLanguage } from "../i18n/useLanguage"

const MIN_PASSWORD_LENGTH = 6

export default function AuthPage({ initialTab = "login" }) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState(initialTab) // 'login' | 'register'
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useAppDispatch()

    const redirectTo = location.state?.from?.pathname || "/courses"

    const validate = () => {
        if (activeTab === "register" && fullName.trim().length < 2) {
            return t("auth.errors.nameTooShort")
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            return t("auth.errors.passwordTooShort", { min: MIN_PASSWORD_LENGTH })
        }
        return ""
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationError = validate()
        if (validationError) {
            setError(validationError)
            return
        }

        setError("")
        setLoading(true)

        const { data, error: authError } = activeTab === "login"
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, role: "student" } } })

        if (authError) {
            setError(authError.message)
            setLoading(false)
            return
        }

        // Если в проекте включено подтверждение email, при регистрации
        // Supabase вернёт пользователя без активной сессии — нельзя считать
        // его залогиненным, пока он не подтвердит почту.
        if (!data.session) {
            setLoading(false)
            dispatch(addNotification({
                message: t("auth.notifications.confirmEmail"),
                type: "info",
            }))
            setActiveTab("login")
            return
        }

        const safeUser = {
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || fullName,
            email: data.user.email,
            role: data.user.user_metadata?.role || "student",
        }
        localStorage.setItem("user", JSON.stringify(safeUser))
        dispatch(setUser(safeUser))
        dispatch(addNotification({ message: t("auth.notifications.welcomeBack", { name: safeUser.full_name || safeUser.email }), type: "success" }))
        setLoading(false)
        navigate(redirectTo, { replace: true })
    }

    useDocumentTitle(activeTab === "login" ? t("meta.login") : t("meta.register"))

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-bg px-4 py-16">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 w-full max-w-md">
                <h1 className="text-3xl font-heading text-text text-center">{t("auth.welcome")}</h1>
                <p className="text-text text-center text-sm mt-2 mb-6">{t("auth.subtitle")}</p>

                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        type="button"
                        className={`flex-1 pb-3 text-sm tracking-wide uppercase ${activeTab === "login" ? "text-primary border-b-2 border-primary" : "text-text/60"}`}
                        onClick={() => { setActiveTab("login"); setError("") }}
                    >
                        {t("auth.loginTab")}
                    </button>
                    <button
                        type="button"
                        className={`flex-1 pb-3 text-sm tracking-wide uppercase ${activeTab === "register" ? "text-primary border-b-2 border-primary" : "text-text/60"}`}
                        onClick={() => { setActiveTab("register"); setError("") }}
                    >
                        {t("auth.registerTab")}
                    </button>
                </div>

                {error && <p className="text-red-600 text-sm mb-4" role="alert">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                    {activeTab === "register" && (
                        <div>
                            <label htmlFor="fullName" className="block text-xs font-medium text-text uppercase tracking-wide mb-1">{t("auth.nameLabel")}</label>
                            <input
                                id="fullName"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-xs font-medium text-text uppercase tracking-wide mb-1">{t("auth.emailLabel")}</label>
                        <input
                            id="email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            type="email" placeholder="example@mail.com" value={email} onChange={e => setEmail(e.target.value)} required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-xs font-medium text-text uppercase tracking-wide mb-1">{t("auth.passwordLabel")}</label>
                        <input
                            id="password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            type="password" value={password} onChange={e => setPassword(e.target.value)}
                            minLength={MIN_PASSWORD_LENGTH} required
                        />
                    </div>
                    <button type="submit" disabled={loading}
                        className="bg-primary hover:bg-primary-hover text-white uppercase tracking-wide text-sm rounded-full px-8 py-3 mt-2 disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading && <Spinner />}
                        {loading ? t("auth.loading") : activeTab === "login" ? t("auth.submitLogin") : t("auth.submitRegister")}
                    </button>
                </form>

                <p className="text-sm text-text text-center mt-4">
                    {activeTab === "login" ? (
                        <>{t("auth.noAccount")}{" "}
                            <button type="button" className="text-primary underline" onClick={() => setActiveTab("register")}>
                                {t("auth.registerLink")}
                            </button>
                        </>
                    ) : (
                        <>{t("auth.haveAccount")}{" "}
                            <button type="button" className="text-primary underline" onClick={() => setActiveTab("login")}>
                                {t("auth.loginLink")}
                            </button>
                        </>
                    )}
                </p>
                <p className="text-xs text-text/50 text-center mt-2">
                    {t("auth.agreementPrefix")} <Link to="/terms" className="underline">{t("auth.termsOfUse")}</Link> {t("auth.agreementMiddle")}{" "}
                    <Link to="/privacy" className="underline">{t("auth.privacyPolicy")}</Link>{t("auth.agreementSuffix")}
                </p>
            </div>
        </div>
    )
}
