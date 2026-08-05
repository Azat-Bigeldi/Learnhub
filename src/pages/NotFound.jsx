import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function NotFound() {
    useDocumentTitle('Страница не найдена')

    return (
        <section className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6 text-center bg-bg text-text">
            <h1 className="text-6xl font-heading text-primary">404</h1>
            <p className="text-lg text-text/70 max-w-md">
                Страница, которую вы ищете, не существует или была перемещена.
            </p>
            <Link
                to="/"
                className="bg-primary hover:bg-primary-hover text-white uppercase tracking-wide text-sm px-8 py-3 rounded-full transition-colors no-underline"
            >
                На главную
            </Link>
        </section>
    )
}
