import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useAppDispatch } from "../store"
import { addNotification } from "../store/notificationSlice.js"
import useDocumentTitle from "../hooks/useDocumentTitle"
import Spinner from "../components/Spinner"
import { useLanguage } from "../i18n/useLanguage"

function formatRegisteredAt(isoString, language) {
    if (!isoString) return "—"
    try {
        return new Date(isoString).toLocaleString(language === "kz" ? "kk-KZ" : "ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    } catch {
        return isoString
    }
}

export default function AdminPage() {
    const { t, language } = useLanguage()
    useDocumentTitle(t("admin.pageTitle"))
    const dispatch = useAppDispatch()

    const [profiles, setProfiles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    // Отслеживаем, для какого пользователя сейчас идёт запрос на смену
    // доступа — чтобы задизейблить именно его кнопку, а не все сразу.
    const [pendingId, setPendingId] = useState(null)

    useEffect(() => {
        let isMounted = true

        async function loadProfiles() {
            setIsLoading(true)
            setLoadError("")
            const { data, error } = await supabase
                .from("profiles")
                .select("id, full_name, email, role, has_access, created_at")
                .order("created_at", { ascending: false })

            if (!isMounted) return
            if (error) {
                setLoadError(t("admin.loadError"))
                setIsLoading(false)
                return
            }
            setProfiles(data || [])
            setIsLoading(false)
        }

        loadProfiles()
        return () => {
            isMounted = false
        }
    }, [t])

    const filteredProfiles = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        if (!query) return profiles
        return profiles.filter((profile) => (
            (profile.full_name || "").toLowerCase().includes(query) ||
            (profile.email || "").toLowerCase().includes(query)
        ))
    }, [profiles, searchQuery])

    const handleToggleAccess = async (profile) => {
        setPendingId(profile.id)
        const nextAccess = !profile.has_access

        const { error } = await supabase
            .from("profiles")
            .update({ has_access: nextAccess })
            .eq("id", profile.id)

        setPendingId(null)

        if (error) {
            dispatch(addNotification({ message: t("admin.accessUpdateError"), type: "error" }))
            return
        }

        setProfiles((prev) => prev.map((item) => (
            item.id === profile.id ? { ...item, has_access: nextAccess } : item
        )))

        const displayName = profile.full_name || profile.email
        dispatch(addNotification({
            message: t(nextAccess ? "admin.accessUpdateSuccessGrant" : "admin.accessUpdateSuccessRevoke", { name: displayName }),
            type: "success",
        }))
    }

    return (
        <section className="bg-bg text-text min-h-[70vh] px-4 sm:px-6 md:px-16 py-10 sm:py-16">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-serif mb-2">{t("admin.heading")}</h1>
                <p className="text-text/60 mb-6">{t("admin.subtitle")}</p>

                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("admin.searchPlaceholder")}
                    className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 mb-6 bg-white"
                />

                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Spinner size={28} />
                    </div>
                ) : loadError ? (
                    <p className="text-red-600 text-sm" role="alert">{loadError}</p>
                ) : filteredProfiles.length === 0 ? (
                    <p className="text-text/50 text-sm">{t("admin.emptyState")}</p>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        {/* Таблица — на десктопе */}
                        <table className="w-full text-sm hidden md:table">
                            <thead>
                                <tr className="border-b border-gray-200 text-left text-text/50 uppercase text-xs tracking-wide">
                                    <th className="px-5 py-3 font-medium">{t("admin.columnName")}</th>
                                    <th className="px-5 py-3 font-medium">{t("admin.columnEmail")}</th>
                                    <th className="px-5 py-3 font-medium">{t("admin.columnRegisteredAt")}</th>
                                    <th className="px-5 py-3 font-medium">{t("admin.columnAccess")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProfiles.map((profile) => (
                                    <tr key={profile.id} className="border-b border-gray-100 last:border-b-0">
                                        <td className="px-5 py-4">{profile.full_name || "—"}</td>
                                        <td className="px-5 py-4 text-text/70">{profile.email}</td>
                                        <td className="px-5 py-4 text-text/50">{formatRegisteredAt(profile.created_at, language)}</td>
                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleAccess(profile)}
                                                disabled={pendingId === profile.id}
                                                className={`text-xs uppercase tracking-wide px-4 py-1.5 rounded-full transition-colors disabled:opacity-50 ${
                                                    profile.has_access
                                                        ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700"
                                                        : "bg-gray-100 text-text/60 hover:bg-primary/10 hover:text-primary"
                                                }`}
                                            >
                                                {profile.has_access ? t("admin.revokeAccessBtn") : t("admin.grantAccessBtn")}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Карточки — на мобильных */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {filteredProfiles.map((profile) => (
                                <div key={profile.id} className="p-4 flex flex-col gap-2">
                                    <p className="font-medium">{profile.full_name || "—"}</p>
                                    <p className="text-text/70 text-sm">{profile.email}</p>
                                    <p className="text-text/50 text-xs">{formatRegisteredAt(profile.created_at, language)}</p>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleAccess(profile)}
                                        disabled={pendingId === profile.id}
                                        className={`self-start text-xs uppercase tracking-wide px-4 py-1.5 rounded-full transition-colors disabled:opacity-50 mt-1 ${
                                            profile.has_access
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-text/60"
                                        }`}
                                    >
                                        {profile.has_access ? t("admin.revokeAccessBtn") : t("admin.grantAccessBtn")}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
