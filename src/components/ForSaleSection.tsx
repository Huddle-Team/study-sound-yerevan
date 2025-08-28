import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Wrench, Headphones, Camera, Video, MapPin, Navigation, Compass } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProductData } from "@/hooks/useProductData";
import BookingModal from "./BookingModal";
import { useState } from "react";

const iconMap = {
  Headphones,
  Camera,
  Video,
  MapPin,
  Navigation,
  Compass,
  Package,
  Wrench,
};

const ForSaleSection = () => {
  const { t } = useLanguage();
  const { products } = useProductData();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const handleBuyClick = (item: any) => {
    setSelectedProduct(item.name);
    setModalOpen(true);
  };

  const renderSaleCard = (item: any) => {
    const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Package;
    
    return (
      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardHeader className="p-0">
          <div className="relative">
            {item.image ? (
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                <IconComponent className="w-16 h-16 text-primary" />
              </div>
            )}
            <Badge className={`absolute top-4 left-4 ${item.badgeColor}`}>
              {item.badge}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <CardTitle className="text-xl mb-2 text-foreground">{item.name}</CardTitle>
          <p className="text-muted-foreground mb-4">{item.description}</p>
          
          {item.warranty && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-muted-foreground">{item.warranty}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-muted-foreground">Thoroughly tested</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-muted-foreground">Professionally cleaned</span>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-6 pt-0">
          <div className="w-full">
            <div className="text-2xl font-bold text-primary mb-3">{item.price}</div>
            <Button 
              onClick={() => handleBuyClick(item)}
              size="sm" 
              className="w-full"
              variant="default"
            >
              {t('common.buy')}
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <section id="for-sale" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t('forSaleSection.title')}</h2>
          <p className="text-xl text-muted-foreground">
            {t('forSaleSection.subtitle')}
          </p>
        </div>

        {/* Audio Equipment for Sale */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">
            {t('forSaleSection.audioEquipment')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.audio && products.audio.map((item) => renderSaleCard(item))}
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        actionType="buy"
        productName={selectedProduct}
      />
    </section>
  );
};

export default ForSaleSection;