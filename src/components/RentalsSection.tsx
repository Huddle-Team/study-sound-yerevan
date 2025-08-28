import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Video, MapPin, Navigation, Compass, Headphones, Mic, Volume2 } from "lucide-react";
import noiseCancellingImage from "@/assets/noise-cancelling.jpg";
import studioHeadphonesImage from "@/assets/studio-headphones.jpg";
import usbHeadsetImage from "@/assets/usb-headset.jpg";

const RentalsSection = () => {
  const audioRentals = [
    {
      id: 1,
      name: "Noise-Cancelling Headphones",
      description: "Perfect for libraries and focus sessions. Block out distractions.",
      price: "From 3,000 AMD/day",
      image: noiseCancellingImage,
      features: ["Active noise cancellation", "30+ hour battery", "Comfortable padding"],
      icon: Headphones
    },
    {
      id: 2,
      name: "Studio Headphones",
      description: "Clean, neutral sound for editing and music practice.",
      price: "From 2,000 AMD/day",
      image: studioHeadphonesImage,
      features: ["Flat frequency response", "Open-back design", "Professional grade"],
      icon: Volume2
    },
    {
      id: 3,
      name: "USB Headsets with Mic",
      description: "Perfect for online classes, Zoom calls, and presentations.",
      price: "From 1,500 AMD/day",
      image: usbHeadsetImage,
      features: ["Clear microphone", "USB plug-and-play", "Noise cancelling mic"],
      icon: Mic
    }
  ];

  const cameraRentals = [
    {
      id: 4,
      name: "DSLR Camera",
      description: "Professional photography for projects and assignments.",
      price: "From 4,500 AMD/day",
      features: ["24MP sensor", "Full HD video", "Interchangeable lenses"],
      icon: Camera
    },
    {
      id: 5,
      name: "Action Camera",
      description: "Compact recording for field work and presentations.",
      price: "From 2,800 AMD/day",
      features: ["4K video recording", "Waterproof case", "Stabilization"],
      icon: Video
    },
    {
      id: 6,
      name: "Webcam HD",
      description: "High-quality streaming for online classes and meetings.",
      price: "From 1,200 AMD/day",
      features: ["1080p resolution", "Auto-focus", "Built-in microphone"],
      icon: Camera
    }
  ];

  const gpsRentals = [
    {
      id: 7,
      name: "Handheld GPS",
      description: "Precision navigation for fieldwork and research.",
      price: "From 3,200 AMD/day",
      features: ["High accuracy", "Preloaded maps", "Long battery life"],
      icon: MapPin
    },
    {
      id: 8,
      name: "Car GPS Navigator",
      description: "Vehicle navigation for field trips and surveys.",
      price: "From 2,000 AMD/day",
      features: ["Traffic updates", "Voice guidance", "Large display"],
      icon: Navigation
    },
    {
      id: 9,
      name: "GPS Watch",
      description: "Wearable tracking for outdoor activities and research.",
      price: "From 2,500 AMD/day",
      features: ["Heart rate monitor", "Activity tracking", "Water resistant"],
      icon: Compass
    }
  ];

  const renderRentalCard = (rental: any, hasImage = false) => (
    <Card key={rental.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardHeader className="p-0">
        <div className="relative">
          {hasImage ? (
            <img 
              src={rental.image} 
              alt={rental.name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <rental.icon className="w-16 h-16 text-primary" />
            </div>
          )}
          <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
            For Rent
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
          <p className="text-xs text-muted-foreground">
            Includes: case, cable, hygiene covers
          </p>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <section id="rentals" className="py-20 bg-secondary/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Available for Rent</h2>
          <p className="text-xl text-muted-foreground">
            Professional tech equipment at student-friendly daily rates
          </p>
        </div>

        {/* Audio Equipment Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">Audio Equipment</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {audioRentals.map((rental) => renderRentalCard(rental, true))}
          </div>
        </div>

        {/* Camera Equipment Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">Camera Equipment</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cameraRentals.map((rental) => renderRentalCard(rental, false))}
          </div>
        </div>

        {/* GPS Equipment Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">GPS & Navigation</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gpsRentals.map((rental) => renderRentalCard(rental, false))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentalsSection;