export default function Results() {
    return (
        <section className="results">
            <div className="container">
                <div className="results-container">
                    <h2 className="results-title">
                        Результаты наших студентов
                    </h2>
                    <div className="top-slider">
                        <button className="arrow-slider-left"></button>
                        <div className="slides" id="slides">
                            <div className="slider-card">
                                <img src="" alt="" />
                                <div className="slider-info">
                                    <h3 className="slider-name">Нурай • Физика • 45</h3>
                                    <p className="slider-score">45 баллов</p>
                                </div>
                            </div>
                            <div className="slider-card">
                                <img src="" alt="" />
                                <div className="slider-info">
                                    <h3 className="slider-name">Нурай • Физика • 45</h3>
                                    <p className="slider-score">45 баллов</p>
                                </div>
                            </div>
                            <div className="slider-card">
                                <img src="" alt="" />
                                <div className="slider-info">
                                    <h3 className="slider-name">Нурай • Физика • 45</h3>
                                    <p className="slider-score">45 баллов</p>
                                </div>
                            </div>
                            <div className="slider-card">
                                <img src="" alt="" />
                                <div className="slider-info">
                                    <h3 className="slider-name">Нурай • Физика • 45</h3>
                                    <p className="slider-score">45 баллов</p>
                                </div>
                            </div>
                            <div className="slider-card">
                                <img src="" alt="" />
                                <div className="slider-info">
                                    <h3 className="slider-name">Нурай • Физика • 45</h3>
                                    <p className="slider-score">45 баллов</p>
                                </div>
                            </div>
                        </div>
                        <button className="arrow-slider-right"></button>
                        <div class="dots">
                            <span class="dot active" onClick="goToSlide(0)"></span>
                            <span class="dot" onClick="goToSlide(1)"></span>
                            <span class="dot" onClick="goToSlide(2)"></span>
                            <span class="dot" onClick="goToSlide(3)"></span>
                            <span class="dot" onClick="goToSlide(4)"></span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}