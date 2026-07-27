import { useState } from "react"

export default function Faq() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "Как записаться на курс?",
            answer: "Чтобы записаться на курс, выберите интересующий вас курс на странице 'Курсы' и нажмите кнопку 'Записаться'."
        },
        {
            question: "Какие материалы предоставляются?",
            answer: "Мы предоставляем видео-уроки, практические тесты и доступ к личному куратору для помощи в обучении."
        },
        {
            question: "Можно ли получить возврат средств?",
            answer: "Да, вы можете запросить возврат средств в течение 24 часов после начала курса, если вы не удовлетворены качеством обучения."
        }
    ];

    return (
        <section className="faq">
            <div className="container">
                <h2 className="faq-title">Часто задаваемые вопросы</h2>
                <div className="faq-accordion">
                    {faqData.map((item, index) => (
                        <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                            <div className="faq-question" onClick={() => toggleAccordion(index)}>
                                {item.question}
                            </div>
                            {activeIndex === index && (
                                <div className="faq-answer">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}



