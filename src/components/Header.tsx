import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRentals = () => {
    document.getElementById('rentals')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/e6dd464b-2ef6-448d-bfd1-275f6f65b1ed.png" 
            alt="SpyTech Student Audio Logo" 
            className="w-10 h-10"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">SpyTech</h1>
            <p className="text-xs text-muted-foreground">Student Audio</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={scrollToRentals}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Rentals
          </button>
          <button 
            onClick={() => document.getElementById('for-sale')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            For Sale
          </button>
          <button 
            onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </button>
        </nav>

        {/* CTA Button */}
        <Button 
          variant="default" 
          size="sm" 
          onClick={scrollToBooking}
          className="rounded-lg"
        >
          Book Now
        </Button>
      </div>
    </header>
  );
};

export default Header;