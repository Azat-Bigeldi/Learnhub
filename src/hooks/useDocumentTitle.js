import { useEffect } from 'react'

const SITE_NAME = 'AtokSchool'

/**
 * Устанавливает заголовок вкладки браузера для текущей страницы.
 * @param {string} title — заголовок страницы без названия сайта
 */
export default function useDocumentTitle(title) {
    useEffect(() => {
        const previousTitle = document.title
        document.title = title ? `${title} — ${SITE_NAME}` : SITE_NAME
        return () => {
            document.title = previousTitle
        }
    }, [title])
}
