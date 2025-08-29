import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Video, MapPin, Navigation, Compass, Headphones, Mic, Volume2, Package, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProductData } from "@/hooks/useProductData";
import { useGPS } from "@/contexts/GPSContext";
import { toast } from "sonner";
import BookingModal from "./BookingModal";
import { useState } from "react";

const iconMap = {
  Headphones,
  Volume2,
  Mic,
  Camera,
  Video,
  MapPin,
  Navigation,
  Compass,
  Package,
  Wrench,
};

const RentalsSection = () => {
  const { t } = useLanguage();
  const { rentals } = useProductData();
  const { getCurrentLocation, addTracking } = useGPS();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const handleRentClick = (rental: any) => {
    setSelectedProduct(rental.name);
    setModalOpen(true);
  };

  const handleRentWithGPS = async (item: any) => {
    if (item.gpsTracking) {
      try {
        const location = await getCurrentLocation();
        if (location) {
          // Add tracking for this rental (in a real app, this would be done after booking confirmation)
          addTracking({
            itemId: item.id,
            userEmail: 'demo@example.com', // This would come from user context
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            currentLocation: location,
            isActive: true,
          });
          
          toast.success(`GPS tracking enabled for ${item.name}. Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
        } else {
          toast.error("Unable to get current location for GPS tracking");
        }
      } catch (error) {
        console.error('GPS tracking error:', error);
        toast.error("GPS tracking is not available");
      }
    }
  };

  const renderRentalCard = (rental: any, hasImage = false) => {
    const IconComponent = iconMap[rental.icon as keyof typeof iconMap] || Package;
    
    return (
      <Card key={rental.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardHeader className="p-0">
          <div className="relative">
            {hasImage && rental.image ? (
              <img 
                src={rental.image} 
                alt={rental.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                <IconComponent className="w-16 h-16 text-primary" />
              </div>
            )}
            <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
              {t('common.forRent')}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <CardTitle className="text-xl mb-2 text-foreground">{rental.name}</CardTitle>
          <p className="text-muted-foreground mb-4">{rental.description}</p>
          
          <div className="space-y-2">
            {rental.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0">
          <div className="w-full">
            <div className="text-2xl font-bold text-primary mb-2">{rental.price}</div>
            <p className="text-xs text-muted-foreground mb-3">
              {t('common.includes')}
            </p>
            <Button 
              onClick={() => handleRentClick(rental)}
              size="sm" 
              className="w-full"
              variant="outline"
            >
              {t('common.rent')}
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <section id="rentals" className="py-20 bg-secondary/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t('rentals.title')}</h2>
          <p className="text-xl text-muted-foreground">
            {t('rentals.subtitle')}
          </p>
        </div>

        {/* All Equipment in One Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Audio Equipment */}
          {rentals.audio && rentals.audio.map((rental) => renderRentalCard(rental, true))}
          
          {/* Only show Micro Camera from camera equipment */}
          {rentals.camera && rentals.camera
            .filter((rental) => rental.id === 10) // Only show micro camera (id 10)
            .map((rental) => renderRentalCard(rental, true))
          }
        </div>
      </div>

      {/* Rental Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        actionType="rent"
        productName={selectedProduct}
      />
    </section>
  );
};

export default RentalsSection;