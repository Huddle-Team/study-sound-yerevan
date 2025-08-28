import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import BookingModal from "./BookingModal";

export function BookingForm() {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const handleBookCallClick = () => {
    setModalOpen(true);
  };

  return (
    <section id="booking" className="py-20 bg-secondary/20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-foreground">{t('booking.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('booking.subtitle')}
          </p>
          <div className="pt-4">
            <Button 
              onClick={handleBookCallClick}
              size="lg" 
              className="px-8 py-3 text-lg"
              variant="default"
            >
              {t('booking.bookCall')}
            </Button>
          </div>
        </div>
      </div>

      {/* Book Call Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        actionType="book"
      />
    </section>
  );
}

export default BookingForm;
