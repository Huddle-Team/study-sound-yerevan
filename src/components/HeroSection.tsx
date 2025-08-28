import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-headphones.jpg";

const HeroSection = () => {
  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPrices = () => {
    document.getElementById('rentals')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Rent or Buy <span className="text-primary">Headphones</span> for Study
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Affordable student audio gear in Yerevan—book with your name & phone, we'll call to confirm.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={scrollToBooking}
              className="text-lg px-8 py-6 rounded-xl"
            >
              Book a Call
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToPrices}
              className="text-lg px-8 py-6 rounded-xl"
            >
              See Prices
            </Button>
          </div>

          <p className="text-sm text-muted-foreground border border-border rounded-lg p-4 bg-secondary/50">
            <strong>No online payments</strong> — booking only.
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
              From 1,500 AMD/day
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;