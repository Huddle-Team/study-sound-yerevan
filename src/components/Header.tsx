import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import BookingModal from "./BookingModal";
import LanguageSelector from "./LanguageSelector";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { t, language } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToRentals = () => {
    document.getElementById('rentals')?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false); // Close menu after navigation
  };

  const scrollToFooter = () => {
    document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false); // Close menu after navigation
  };

  const openBookingModal = () => {
    setModalOpen(true);
    setMobileMenuOpen(false); // Close menu when opening modal
  };

  const handleNavClick = (action: () => void) => {
    action();
    setMobileMenuOpen(false); // Close menu after any navigation
  };

  // Get language-specific class
  const getLanguageClass = () => {
    if (language === 'hy') return 'armenian-text';
    if (language === 'ru') return 'russian-text';
    return '';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border ${getLanguageClass()}`}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/e6dd464b-2ef6-448d-bfd1-275f6f65b1ed.png" 
              alt="SpyTech Student Audio Logo" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">SpyTech</h1>
              <p className="text-xs text-muted-foreground">Exam Tools</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <button 
              onClick={scrollToRentals}
              className="nav-responsive text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('navigation.rentals')}
            </button>
            <button 
              onClick={() => document.getElementById('for-sale')?.scrollIntoView({ behavior: 'smooth' })}
              className="nav-responsive text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('navigation.forSale')}
            </button>
            <button 
              onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
              className="nav-responsive text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </button>
            <button 
              onClick={scrollToFooter}
              className="nav-responsive text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('common.contact')}
            </button>
          </nav>

          {/* Language Selector and CTA Button */}
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Button 
              variant="default" 
              size="sm" 
              onClick={openBookingModal}
              className="btn-responsive rounded-lg"
            >
              {t('cta.bookNow')}
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/e6dd464b-2ef6-448d-bfd1-275f6f65b1ed.png" 
                alt="SpyTech Student Audio Logo" 
                className="w-8 h-8"
              />
              <div>
                <h1 className="text-lg font-bold text-foreground">SpyTech</h1>
                <p className="text-xs text-muted-foreground">Exam Tools</p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-all duration-300 rounded-full bg-muted/50 hover:bg-muted border border-border/20"
            >
              <div className={`transition-transform duration-300 ${mobileMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </div>
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-white/100 backdrop-blur-none z-40 animate-in fade-in duration-300" style={{backgroundColor: '#ffffff'}}>
              {/* Close Button */}
              <div className="absolute top-4 right-6 z-50">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="flex flex-col items-center justify-center min-h-screen space-y-8 px-6 animate-in slide-in-from-top duration-500" style={{backgroundColor: '#ffffff'}}>
                {/* Navigation Links */}
                <button 
                  onClick={() => handleNavClick(scrollToRentals)}
                  className="text-2xl text-foreground hover:text-primary transition-all duration-200 hover:scale-105"
                >
                  {t('navigation.rentals')}
                </button>
                <button 
                  onClick={() => handleNavClick(() => document.getElementById('for-sale')?.scrollIntoView({ behavior: 'smooth' }))}
                  className="text-2xl text-foreground hover:text-primary transition-all duration-200 hover:scale-105"
                >
                  {t('navigation.forSale')}
                </button>
                <button 
                  onClick={() => handleNavClick(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }))}
                  className="text-2xl text-foreground hover:text-primary transition-all duration-200 hover:scale-105"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => handleNavClick(scrollToFooter)}
                  className="text-2xl text-foreground hover:text-primary transition-all duration-200 hover:scale-105"
                >
                  {t('common.contact')}
                </button>

                {/* Language Selector and CTA */}
                <div className="flex flex-col items-center gap-6 mt-8 animate-in slide-in-from-bottom duration-700">
                  <LanguageSelector />
                  <Button 
                    variant="default" 
                    size="lg" 
                    onClick={openBookingModal}
                    className="rounded-lg px-8 py-3 text-lg hover:scale-105 transition-transform duration-200"
                  >
                    {t('cta.bookNow')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        actionType="book"
      />
    </header>
  );
};

export default Header;