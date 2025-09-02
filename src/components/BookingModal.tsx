import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { submitBooking } from "@/lib/api";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'book' | 'rent' | 'buy';
  productName?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, actionType, productName }) => {
  const { t, language } = useLanguage();
  const [rentals, setRentals] = useState<any[]>([]);
  const [saleItems, setSaleItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    selectedActionType: actionType === 'book' ? '' : actionType === 'buy' ? 'buy' : 'rent',
    selectedRentItem: '',
    selectedSaleItem: '',
    rentalStartDate: '',
    rentalEndDate: ''
  });
  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load data from JSON files
  useEffect(() => {
    const loadData = async () => {
      try {
        const [rentalsResponse, productsResponse] = await Promise.all([
          import('@/data/rentals.json'),
          import('@/data/products.json')
        ]);
        
        // Only include rentals that are displayed on the website (audio and only micro camera)
        const allRentals = [
          ...rentalsResponse.audioRentals,
          ...rentalsResponse.cameraRentals.filter((camera: any) => camera.id === 10)  // Only micro camera
        ];
        
        // Only include sale items that are displayed on the website (only audio)  
        const allSaleItems = [
          ...productsResponse.audioSaleItems
        ];
        
        setRentals(allRentals);
        setSaleItems(allSaleItems);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  // Update selectedActionType when actionType prop changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      selectedActionType: actionType === 'book' ? '' : actionType === 'buy' ? 'buy' : 'rent'
    }));
  }, [actionType]);

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) {
      return 'Name is required';
    }
    if (!/^[a-zA-ZáàâäãåąčćđéèêëęëĞğỊịİıĺłľńňőóôöõøŕřşšťūúůüưvýỳỹŶŷŽžЁёЀѐЅѕЄєЁёЋћЂђЅѕІіЇїЈјЉљЊњЋћЌќЎўЏџАаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЫыЬьЭэЮюЯяՀհԱաԲբԳգԴդԵեԶզԷէԸըԹթԺժԻիԼլԽխԾծԿկՀհՁձՂղՃճՄմՅյՆնՇշՈոՉչՊպՋջՌռՍսՎվՏտՐրՑցՒւՓփՔքՕօՖֆ\s]+$/.test(name)) {
      return 'Name should contain only letters and spaces';
    }
    return '';
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      return 'Phone number is required';
    }
    if (!/^[\d\s\+\-\(\)]+$/.test(phone)) {
      return 'Phone number should contain only numbers and basic formatting (+, -, space, parentheses)';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const nameError = validateName(formData.fullName);
    const phoneError = validatePhone(formData.phoneNumber);
    
    setErrors({
      fullName: nameError,
      phoneNumber: phoneError
    });

    // If there are validation errors, stop submission
    if (nameError || phoneError) {
      toast.error('Please fix the errors and try again');
      return;
    }

    // Additional validation for specific action types
    if (actionType === 'book') {
      if (!formData.selectedActionType) {
        toast.error(t('modal.fillAllFields'));
        return;
      }
      if (formData.selectedActionType === 'rent' && !formData.selectedRentItem) {
        toast.error(t('modal.fillAllFields'));
        return;
      }
      if (formData.selectedActionType === 'buy' && !formData.selectedSaleItem) {
        toast.error(t('modal.fillAllFields'));
        return;
      }
    } else if (actionType === 'rent') {
      if (!formData.selectedRentItem) {
        toast.error(t('modal.fillAllFields'));
        return;
      }
    } else if (actionType === 'buy') {
      if (!formData.selectedSaleItem) {
        toast.error(t('modal.fillAllFields'));
        return;
      }
    }

    // Send data to backend API
    const bookingData = {
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      selectedActionType: formData.selectedActionType as 'rent' | 'buy',
      selectedRentItem: formData.selectedRentItem || undefined,
      selectedSaleItem: formData.selectedSaleItem || undefined,
      productName: productName,
      rentalStartDate: formData.rentalStartDate || undefined,
      rentalEndDate: formData.rentalEndDate || undefined
    };

    // Show loading state
    const loadingToast = toast.loading('Sending booking request...');

    try {
      const result = await submitBooking(bookingData);
      
      if (result.success) {
        toast.dismiss(loadingToast);
        toast.success(result.message || 'Booking request sent successfully!');
        setShowSuccessMessage(true);
      } else {
        toast.dismiss(loadingToast);
        toast.error(result.error || 'Failed to send booking request. Please try again or contact us directly.');
        return;
      }
    } catch (error) {
      console.error('Error sending booking:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to send booking request. Please try again or contact us directly.');
      return;
    }
    
    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setShowSuccessMessage(false);
      setFormData({ 
        fullName: '', 
        phoneNumber: '', 
        selectedActionType: actionType === 'book' ? '' : actionType === 'buy' ? 'buy' : 'rent',
        selectedRentItem: '',
        selectedSaleItem: '',
        rentalStartDate: '',
        rentalEndDate: ''
      });
      setErrors({
        fullName: '',
        phoneNumber: ''
      });
      onClose();
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (field === 'fullName' && errors.fullName) {
      setErrors(prev => ({ ...prev, fullName: '' }));
    }
    if (field === 'phoneNumber' && errors.phoneNumber) {
      setErrors(prev => ({ ...prev, phoneNumber: '' }));
    }
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
                className={errors.fullName ? 'border-red-500' : ''}
                required
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t('modal.phoneNumber')}</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder={t('modal.phoneNumberPlaceholder')}
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={errors.phoneNumber ? 'border-red-500' : ''}
                required
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Show action type selector only for book action */}
            {actionType === 'book' && (
              <div className="space-y-2">
                <Label htmlFor="actionType">{t('modal.actionType')}</Label>
                <Select value={formData.selectedActionType} onValueChange={(value) => handleInputChange('selectedActionType', value)}>
                  <SelectTrigger id="actionType">
                    <SelectValue placeholder={t('modal.actionTypePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">{t('modal.actionTypeRent')}</SelectItem>
                    <SelectItem value="buy">{t('modal.actionTypeSale')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Show rental options for rent action or when rent is selected in book */}
            {(actionType === 'rent' || (actionType === 'book' && formData.selectedActionType === 'rent')) && (
              <div className="space-y-2">
                <Label htmlFor="rentVariant">{t('modal.rentVariant')}</Label>
                <Select value={formData.selectedRentItem} onValueChange={(value) => handleInputChange('selectedRentItem', value)}>
                  <SelectTrigger id="rentVariant">
                    <SelectValue placeholder={t('modal.rentVariantPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {rentals.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.names[language] || item.names.en} - {item.prices[language] || item.prices.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Show rental date/time fields for rent action or when rent is selected in book */}
            {(actionType === 'rent' || (actionType === 'book' && formData.selectedActionType === 'rent')) && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="rentalStartDate">Start Date</Label>
                    <Input
                      id="rentalStartDate"
                      type="date"
                      value={formData.rentalStartDate}
                      onChange={(e) => handleInputChange('rentalStartDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rentalEndDate">End Date</Label>
                    <Input
                      id="rentalEndDate"
                      type="date"
                      value={formData.rentalEndDate}
                      onChange={(e) => handleInputChange('rentalEndDate', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Show sale options for buy action or when buy is selected in book */}
            {(actionType === 'buy' || (actionType === 'book' && formData.selectedActionType === 'buy')) && (
              <div className="space-y-2">
                <Label htmlFor="saleItem">{t('modal.saleItem')}</Label>
                <Select value={formData.selectedSaleItem} onValueChange={(value) => handleInputChange('selectedSaleItem', value)}>
                  <SelectTrigger id="saleItem">
                    <SelectValue placeholder={t('modal.saleItemPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {saleItems.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.names[language] || item.names.en} - {item.prices[language] || item.prices.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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
