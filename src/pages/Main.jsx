export default function Main() {
  return (
    <>  
        <hr className="w-full border-gray-300" />
        <section className="px-64 py-24 bg-bg text-text">
            <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto text-center">
                <h1 className="text-5xl font-serif leading-tight ">Подготовься к ЕНТ на <span className="text-primary font-['DM_Serif_Display'] italic">45+ баллов</span> с <span className="italic">Atok School</span></h1>
                <p className="leading-7 text-text max-w-3xl mx-auto">Персональная подготовка к ЕНТ по физике с экспертом, который знает предмет изнутри. Живые уроки, практика и разбор каждой ошибки.</p>
                <button className="bg-primary hover:bg-primary-hover text-white uppercase tracking-wide text-sm font-medium px-8 py-4 rounded-full transition-colors">Начать обучение</button>
            </div>
        </section>
        
        <section className="w-full bg-white text-text px-16 py-12">
            <div className="container">
                <div className="grid grid-cols-4 gap-8 text-center py-16 divide-x divide-gray-200">
                    <div>
                        <h3 className="text-primary text-3xl font-['DM_Serif_Display']">5000+</h3>
                        <p className="text-m text-text">студентов</p>
                    </div>
                    <div>
                        <h3 className="text-primary text-3xl font-['DM_Serif_Display']">95%</h3>
                        <p className="text-m text-text">успешной сдачи ЕНТ</p>
                    </div>
                    <div>
                        <h3 className="text-primary text-3xl font-['DM_Serif_Display']">10+</h3>
                        <p className="text-m text-text">лет опыта</p>
                    </div>
                    <div>
                        <h3 className="text-primary text-3xl font-['DM_Serif_Display']">50/50</h3>
                        <p className="text-m text-text">4 года подряд</p>
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-primary">
            <div className="container">
                <div className="about-information">
                    <h2>Почему мы?</h2>
                    <div className="about-cards">
                        <img src="" alt="" />
                        <h3>Видео-уроки</h3>
                        <p>Смотри уроки в любое время. Удобный формат для повторения материала.</p>

                        <img src="" alt="" />
                        <h3>Практические тесты</h3>
                        <p>Закрепляй знания на реальных тестах, максимально приближенных к ЕНТ.</p>

                        <img src="" alt="" />
                        <h3>Кураторы</h3>
                        <p>Личный куратор следит за твоим прогрессом и помогает не сбиться с графика подготовки.</p>
                    </div>
                </div>
            </div>
        </section>
        <section className="instructor">
            <div className="container">
                <div className="instructor-container">
                    <div className="instructor-card">
                        <img src="" alt="" />
                        <div className="instructor-content">
                            <span className="badge">Expert Educator</span>
                            <h3 className="instructor-name">
                                Атымтай Жомарт
                            </h3>
                            <p className="instructor-description">
                                With over 15 years of experience in educational psychology and curriculum design, Dr. Johnson has dedicated her career to making complex subjects accessible and engaging for all students.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        

        

    </>
  )
}






