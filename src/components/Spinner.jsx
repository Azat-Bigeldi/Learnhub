import { useLanguage } from "../i18n/useLanguage";

export default function Spinner({ size = 18, className = '' }) {
    const { t } = useLanguage();
    return (
        <span
            role="status"
            aria-label={t("common.loading")}
            className={`inline-block animate-spin rounded-full border-2 border-white/40 border-t-white ${className}`}
            style={{ width: size, height: size }}
        />
    )
}
