import heroImage from "@/assets/hero-dessert.jpg";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="relative h-[600px] lg:h-[750px] overflow-hidden bg-hero-gradient">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful dessert with berries"
          className="w-full h-full object-cover scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dessert-primary/30 via-transparent to-dessert-dark/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-dessert-accent/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-dessert-warm/30 rounded-full blur-2xl animate-pulse delay-1000"></div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
        <div className="text-center text-white animate-slide-up">
          <h2 className="font-display text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            {t('hero.title1')}
            <span className="block bg-accent-gradient bg-clip-text text-transparent">
              {t('hero.title2')}
            </span>
          </h2>
          <p className="text-lg lg:text-xl mb-10 max-w-3xl mx-auto leading-relaxed text-white/90">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-accent-gradient text-white px-10 py-4 rounded-full font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105 transform">
              <span className="mr-2">{t('hero.cta')}</span>
              <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-dessert-cream to-transparent"></div>
    </section>
  );
};

export default HeroSection;