import { Link } from "react-router-dom";
import { openWhatsApp } from "../utils/WhatsApp";
import { useLanguage } from "../i18n/useLanguage";

export default function Footer() {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark w-full">
            <div className="px-4 sm:px-6 md:px-16 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                <div>
                    <h3 className="font-serif font-bold text-[#FAF8F4] pb-4 text-lg">AtokSchool</h3>
                    <p className="text-gray-300 max-w-[368px] pb-4 text-sm sm:text-base">
                        {t("footer.description")}
                    </p>
                    <button
                        type="button"
                        onClick={() => openWhatsApp(t("whatsapp.footerMessage"))}
                        className="text-white bg-[#25D366] hover:bg-[#1ebe5a] max-w-[260px] w-full sm:w-auto px-4 h-10 tracking-wide rounded-2xl transition-colors"
                    >
                        {t("footer.whatsappBtn")}
                    </button>
                </div>

                <div>
                    <h3 className="text-primary pb-4">{t("footer.contactsHeading")}</h3>
                    <div className="text-gray-300 flex flex-col gap-1 text-sm sm:text-base">
                        <p>{t("footer.address")}</p>
                        <p>info@atokschool.kz</p>
                        <p>+7 (777) 123-45-67</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-primary pb-4">{t("footer.documentsHeading")}</h3>
                    <div className="text-gray-300 flex flex-col gap-1 text-sm sm:text-base">
                        <Link to="/privacy" className="hover:text-white transition-colors">{t("footer.privacyLink")}</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">{t("footer.termsLink")}</Link>
                    </div>
                </div>
            </div>
            <div className="flex justify-center border-t border-white/10 text-gray-400 pt-8 pb-12 text-xs sm:text-sm text-center px-4">
                © {currentYear} AtokSchool. {t("footer.rights")}
            </div>
        </footer>
    );
}
