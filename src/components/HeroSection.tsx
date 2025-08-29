import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-headphones.jpg";

const HeroSection = () => {
  const { t } = useLanguage();

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPrices = () => {
    document.getElementById('rentals')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 px-6 pt-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              {t('hero.subtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={scrollToBooking}
              className="text-lg px-8 py-6 rounded-xl"
            >
              {t('cta.bookCall')}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToPrices}
              className="text-lg px-8 py-6 rounded-xl"
            >
              {t('cta.seePrices')}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground border border-border rounded-lg p-4 bg-secondary/50">
            {t('cta.noPayments')}
          </p>
        </div>

        {/* Hero Image */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <img 
              src={heroImage} 
              alt="Premium headphones for student rentals" 
              className="w-full max-w-lg rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground px-6 py-3 rounded-xl font-semibold shadow-lg">
              {t('hero.priceFrom')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;