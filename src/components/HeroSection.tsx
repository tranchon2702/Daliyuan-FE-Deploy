import heroImage from "@/assets/hero-dessert.jpg";

const HeroSection = () => {
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
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
              ✨ Premium Artisan Collection
            </span>
          </div>
          <h2 className="font-display text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Artisan
            <span className="block bg-accent-gradient bg-clip-text text-transparent">
              Desserts
            </span>
          </h2>
          <p className="text-lg lg:text-xl mb-10 max-w-3xl mx-auto leading-relaxed text-white/90">
            Khám phá thế giới bánh ngọt tinh tế với hương vị tuyệt vời và thiết kế hoàn hảo. 
            Mỗi sản phẩm là một tác phẩm nghệ thuật đầy cảm hứng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-accent-gradient text-white px-10 py-4 rounded-full font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105 transform">
              <span className="mr-2">Khám Phá Ngay</span>
              <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-full font-semibold border border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              Xem Bộ Sưu Tập
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