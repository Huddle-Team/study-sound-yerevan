import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import BookingModal from "./BookingModal";
import LanguageSelector from "./LanguageSelector";
import { useState } from "react";

const Header = () => {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const scrollToRentals = () => {
    document.getElementById('rentals')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFooter = () => {
    document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openBookingModal = () => {
    setModalOpen(true);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto container-responsive py-4 flex items-center justify-between">
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
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={scrollToRentals}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors nav-responsive"
          >
            {t('navigation.rentals')}
          </button>
          <button 
            onClick={() => document.getElementById('for-sale')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors nav-responsive"
          >
            {t('navigation.forSale')}
          </button>
          <button 
            onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </button>
          <button 
            onClick={scrollToFooter}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
            className="rounded-lg"
          >
            {t('cta.bookNow')}
          </Button>
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