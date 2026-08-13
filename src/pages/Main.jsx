import { useNavigate } from "react-router-dom";
import play from "../imgsourse/play.png";
import helpcircle from "../imgsourse/helpcircle.png";
import curator from "../imgsourse/curator.png";
import teacher from "../imgsourse/teacher.png";
import FeatureCard from "../components/FeatureCard";
import Results from "./Results";
import Faq from "./Faq";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useLanguage } from "../i18n/useLanguage";

export default function Main() {
    const { t } = useLanguage();
    useDocumentTitle(t("meta.home"));
    const navigate = useNavigate();

    return (
        <>
            <section id="home" className="scroll-anchor px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 py-16 md:py-24 bg-bg text-text">
                <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
                        {t("hero.titleLine1")} <span className="text-primary font-['DM_Serif_Display'] italic">{t("hero.titleHighlight")}</span> {t("hero.titleLine2")}
                    </h1>
                    <p className="leading-7 text-text max-w-3xl mx-auto text-sm sm:text-base">
                        {t("hero.subtitle")}
                    </p>
                    <button
                        onClick={() => navigate("/courses")}
                        className="bg-primary hover:bg-primary-hover text-white uppercase tracking-wide text-xs sm:text-sm font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-colors"
                    >
                        {t("hero.cta")}
                    </button>
                </div>
            </section>

            <section className="w-full bg-white text-text px-4 sm:px-6 md:px-16 py-12">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center py-8 md:py-16 sm:divide-x sm:divide-gray-200">
                        <div>
                            <h3 className="text-primary text-2xl sm:text-3xl font-['DM_Serif_Display']">{t("stats.studentsValue")}</h3>
                            <p className="text-sm sm:text-base text-text">{t("stats.studentsLabel")}</p>
                        </div>
                        <div>
                            <h3 className="text-primary text-2xl sm:text-3xl font-['DM_Serif_Display']">{t("stats.passRateValue")}</h3>
                            <p className="text-sm sm:text-base text-text">{t("stats.passRateLabel")}</p>
                        </div>
                        <div>
                            <h3 className="text-primary text-2xl sm:text-3xl font-['DM_Serif_Display']">{t("stats.experienceValue")}</h3>
                            <p className="text-sm sm:text-base text-text">{t("stats.experienceLabel")}</p>
                        </div>
                        <div>
                            <h3 className="text-primary text-2xl sm:text-3xl font-['DM_Serif_Display']">{t("stats.competitionValue")}</h3>
                            <p className="text-sm sm:text-base text-text">{t("stats.competitionLabel")}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 md:px-12 lg:px-24 py-16 bg-bgo text-text">
                <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-16">
                    <h2 className="text-2xl sm:text-3xl font-serif flex justify-center pt-8 pb-8 md:pt-16 md:pb-16 text-center">{t("whyUs.heading")}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-16">
                        <FeatureCard
                            img={<img src={play} alt="play-icon" className="w-5 h-5" />}
                            title={t("whyUs.feature1Title")}
                            description={t("whyUs.feature1Description")}
                        />
                        <FeatureCard
                            img={<img src={helpcircle} alt="help-circle-icon" className="w-5 h-5" />}
                            title={t("whyUs.feature2Title")}
                            description={t("whyUs.feature2Description")}
                        />
                        <FeatureCard
                            img={<img src={curator} alt="curator-icon" className="w-5 h-5" />}
                            title={t("whyUs.feature3Title")}
                            description={t("whyUs.feature3Description")}
                        />
                    </div>
                </div>
            </section>

            <section id="teacher" className="scroll-anchor px-4 sm:px-6 md:px-12 lg:px-24 py-16 bg-bgs text-text">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center bg-white rounded-2xl p-6 sm:p-10 md:p-16">
                    <div className="flex justify-center items-center">
                        <img src={teacher} alt={t("teacher.photoAlt")} className="w-full max-w-sm object-cover rounded-2xl" />
                    </div>
                    <div className="flex flex-col items-start gap-4">
                        <span className="inline-block bg-[#4ade80] text-[#166534] text-[11px] font-medium tracking-[0.08em] uppercase px-4 py-1.5 rounded-full mb-2 md:mb-4">{t("teacher.badge")}</span>
                        <h3 className="text-xl sm:text-2xl font-serif">{t("teacher.name")}</h3>
                        <p className="text-text/70 leading-relaxed text-sm sm:text-base">
                            {t("teacher.bio")}
                        </p>
                    </div>
                </div>
            </section>

            <Results />
            <Faq />
        </>
    );
}
