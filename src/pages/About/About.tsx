import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useTranslation } from "react-i18next";
import { values } from "./About.script.js";

const About = () => {
  const { t } = useTranslation();
  const translatedValues = values(t);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-dessert-light to-background">
        <div className="container mx-auto px-4 text-center ">
          <Badge variant="secondary" className="mb-4 text-red-600 bg-red-100 border-red-200">
            {t('about_page.badge')}
          </Badge>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t('about_page.hero_title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('about_page.hero_subtitle')}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">
                {t('about_page.story_title')}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {t('about_page.story_p1')}
                </p>
                <p>
                  {t('about_page.story_p2')}
                </p>
                <p>
                  {t('about_page.story_p3')}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-dessert-warm">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=450&fit=crop"
                  alt="Bếp trưởng đang làm bánh"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-elegant ">
                <p className="font-serif text-2xl font-bold text-red-600">10+</p>
                <p className="text-sm text-muted-foreground text-red-600">{t('about_page.experience')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-dessert-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold mb-4">
              {t('about_page.values_title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('about_page.values_subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {translatedValues.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-elegant transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-dessert-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-dessert-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;