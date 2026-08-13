import useDocumentTitle from '../hooks/useDocumentTitle'
import { useLanguage } from '../i18n/useLanguage'

export default function TermsOfService() {
    const { t } = useLanguage();
    useDocumentTitle(t('meta.terms'))
    const paragraphs = t('terms.paragraphs')

    return (
        <section className="px-6 md:px-16 lg:px-24 py-16 max-w-3xl mx-auto text-text">
            <h1 className="text-3xl md:text-4xl font-heading mb-8">{t('terms.title')}</h1>
            <div className="flex flex-col gap-4 text-text/80 leading-relaxed">
                {paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </section>
    )
}
