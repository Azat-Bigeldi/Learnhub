import useDocumentTitle from '../hooks/useDocumentTitle'
import { useLanguage } from '../i18n/useLanguage'

export default function PrivacyPolicy() {
    const { t } = useLanguage();
    useDocumentTitle(t('meta.privacy'))
    const paragraphs = t('privacy.paragraphs')

    return (
        <section className="px-6 md:px-16 lg:px-24 py-16 max-w-3xl mx-auto text-text">
            <h1 className="text-3xl md:text-4xl font-heading mb-8">{t('privacy.title')}</h1>
            <div className="flex flex-col gap-4 text-text/80 leading-relaxed">
                {paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </section>
    )
}
