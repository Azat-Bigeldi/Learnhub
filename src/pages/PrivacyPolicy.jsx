import useDocumentTitle from '../hooks/useDocumentTitle'

export default function PrivacyPolicy() {
    useDocumentTitle('Политика конфиденциальности')

    return (
        <section className="px-6 md:px-16 lg:px-24 py-16 max-w-3xl mx-auto text-text">
            <h1 className="text-3xl md:text-4xl font-heading mb-8">Политика конфиденциальности</h1>
            <div className="flex flex-col gap-4 text-text/80 leading-relaxed">
                <p>
                    AtokSchool собирает только те персональные данные, которые необходимы для оказания
                    образовательных услуг: имя, адрес электронной почты и данные о прогрессе обучения.
                </p>
                <p>
                    Мы не передаём ваши данные третьим лицам, за исключением сервисов, обеспечивающих
                    работу платформы (например, Supabase для хранения учётных записей).
                </p>
                <p>
                    Вы можете в любой момент запросить удаление своей учётной записи и связанных с ней
                    данных, написав нам на info@atokschool.kz.
                </p>
                <p>Дата последнего обновления: 3 января 2026 года.</p>
            </div>
        </section>
    )
}
