import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Wrench, Headphones, Camera, Video, MapPin, Navigation, Compass } from "lucide-react";
import earbudsImage from "@/assets/earbuds.jpg";
import studioHeadphonesImage from "@/assets/studio-headphones.jpg";

const ForSaleSection = () => {
  const audioSaleItems = [
    {
      id: 1,
      name: "Budget Earbuds",
      description: "Great value for everyday study sessions and commuting.",
      price: "From 6,500 AMD",
      image: earbudsImage,
      badge: "New",
      badgeColor: "bg-success text-success-foreground",
      icon: Headphones
    },
    {
      id: 2,
      name: "Refurbished Headphones",
      description: "Tested, cleaned, and guaranteed. Professional quality at student prices.",
      price: "From 12,000 AMD",
      image: studioHeadphonesImage,
      badge: "Refurbished",
      badgeColor: "bg-accent text-accent-foreground",
      icon: Wrench
    },
    {
      id: 3,
      name: "Audio Accessories",
      description: "Adapters, hygiene covers, carrying cases, and replacement cables.",
      price: "From 500 AMD",
      image: null,
      badge: "Accessories",
      badgeColor: "bg-muted text-muted-foreground",
      icon: Package
    }
  ];

  const cameraSaleItems = [
    {
      id: 4,
      name: "Mirrorless Camera (Used)",
      description: "Excellent condition with original packaging and accessories.",
      price: "From 85,000 AMD",
      image: null,
      badge: "Used",
      badgeColor: "bg-accent text-accent-foreground",
      icon: Camera,
      warranty: "6 month warranty"
    },
    {
      id: 5,
      name: "Action Camera (New)",
      description: "Latest model with 4K recording capability and accessories.",
      price: "From 45,000 AMD",
      image: null,
      badge: "New",
      badgeColor: "bg-success text-success-foreground",
      icon: Video,
      warranty: "1 year warranty"
    },
    {
      id: 6,
      name: "Camera Accessories",
      description: "Tripods, memory cards, lens filters, cases and more.",
      price: "From 2,500 AMD",
      image: null,
      badge: "Accessories",
      badgeColor: "bg-muted text-muted-foreground",
      icon: Package
    }
  ];

  const gpsSaleItems = [
    {
      id: 7,
      name: "Professional GPS (Refurb)",
      description: "High-precision navigation unit, tested and cleaned.",
      price: "From 65,000 AMD",
      image: null,
      badge: "Refurbished",
      badgeColor: "bg-accent text-accent-foreground",
      icon: MapPin,
      warranty: "3 month warranty"
    },
    {
      id: 8,
      name: "Car Navigator (New)",
      description: "Latest maps and traffic updates included in the package.",
      price: "From 28,000 AMD",
      image: null,
      badge: "New",
      badgeColor: "bg-success text-success-foreground",
      icon: Navigation,
      warranty: "2 year warranty"
    },
    {
      id: 9,
      name: "GPS Accessories",
      description: "Mounts, cases, chargers, memory cards and more.",
      price: "From 1,800 AMD",
      image: null,
      badge: "Accessories",
      badgeColor: "bg-muted text-muted-foreground",
      icon: Package
    }
  ];

  const renderSaleCard = (item: any) => (
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
              <item.icon className="w-16 h-16 text-primary" />
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
          <div className="text-2xl font-bold text-primary">{item.price}</div>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Equipment for Sale</h2>
          <p className="text-xl text-muted-foreground">
            Quality tech equipment you can own
          </p>
        </div>

        {/* Audio Equipment for Sale */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">Audio Equipment</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {audioSaleItems.map((item) => renderSaleCard(item))}
          </div>
        </div>

        {/* Camera Equipment for Sale */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">Camera Equipment</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cameraSaleItems.map((item) => renderSaleCard(item))}
          </div>
        </div>

        {/* GPS Equipment for Sale */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">GPS & Navigation</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gpsSaleItems.map((item) => renderSaleCard(item))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForSaleSection;