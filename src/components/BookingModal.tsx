import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'book' | 'rent' | 'buy';
  productName?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, actionType, productName }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim() || !formData.phoneNumber.trim()) {
      toast.error(t('modal.fillAllFields'));
      return;
    }

    // Simulate form submission
    setShowSuccessMessage(true);
    
    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setShowSuccessMessage(false);
      setFormData({ fullName: '', phoneNumber: '' });
      onClose();
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getModalTitle = () => {
    switch (actionType) {
      case 'rent':
        return t('modal.rentTitle');
      case 'buy':
        return t('modal.buyTitle');
      default:
        return t('modal.bookTitle');
    }
  };

  const getSubmitButtonText = () => {
    switch (actionType) {
      case 'rent':
        return t('modal.submitRent');
      case 'buy':
        return t('modal.submitBuy');
      default:
        return t('modal.submitBook');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {getModalTitle()}
            {productName && (
              <span className="block text-sm text-muted-foreground font-normal mt-1">
                {productName}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {showSuccessMessage ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              {t('modal.successTitle')}
            </h3>
            <p className="text-muted-foreground">
              {t('modal.successMessage')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('modal.fullName')}</Label>
              <Input
                id="fullName"
                type="text"
                placeholder={t('modal.fullNamePlaceholder')}
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t('modal.phoneNumber')}</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder={t('modal.phoneNumberPlaceholder')}
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                {t('modal.cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1"
              >
                {getSubmitButtonText()}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
