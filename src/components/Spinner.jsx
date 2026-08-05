export default function Spinner({ size = 18, className = '' }) {
    return (
        <span
            role="status"
            aria-label="Загрузка"
            className={`inline-block animate-spin rounded-full border-2 border-white/40 border-t-white ${className}`}
            style={{ width: size, height: size }}
        />
    )
}
