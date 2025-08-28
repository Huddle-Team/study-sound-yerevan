import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import noiseCancellingImage from "@/assets/noise-cancelling.jpg";
import studioHeadphonesImage from "@/assets/studio-headphones.jpg";
import usbHeadsetImage from "@/assets/usb-headset.jpg";

const RentalsSection = () => {
  const rentals = [
    {
      id: 1,
      name: "Noise-Cancelling Headphones",
      description: "Perfect for libraries and focus sessions. Block out distractions.",
      price: "From 3,000 AMD/day",
      image: noiseCancellingImage,
      features: ["Active noise cancellation", "30+ hour battery", "Comfortable padding"]
    },
    {
      id: 2,
      name: "Studio Headphones",
      description: "Clean, neutral sound for editing and music practice.",
      price: "From 2,000 AMD/day",
      image: studioHeadphonesImage,
      features: ["Flat frequency response", "Open-back design", "Professional grade"]
    },
    {
      id: 3,
      name: "USB Headsets with Mic",
      description: "Perfect for online classes, Zoom calls, and presentations.",
      price: "From 1,500 AMD/day",
      image: usbHeadsetImage,
      features: ["Clear microphone", "USB plug-and-play", "Noise cancelling mic"]
    }
  ];

  return (
    <section id="rentals" className="py-20 bg-secondary/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Rental Options</h2>
          <p className="text-xl text-muted-foreground">Quality gear for every study need</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rentals.map((rental) => (
            <Card key={rental.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="p-0">
                <div className="relative">
                  <img 
                    src={rental.image} 
                    alt={rental.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    For Rent
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2 text-foreground">{rental.name}</CardTitle>
                <p className="text-muted-foreground mb-4">{rental.description}</p>
                
                <div className="space-y-2">
                  {rental.features.map((feature, index) => (
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default RentalsSection;