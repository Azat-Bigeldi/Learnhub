export default function FeatureCard({ img, title, description }) {
    return (
        <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {img}
            </div>
            <h3 className="text-lg sm:text-xl font-medium">{title}</h3>
            <p className="text-text/70 leading-relaxed text-sm sm:text-base">{description}</p>
        </div>
    );
}
