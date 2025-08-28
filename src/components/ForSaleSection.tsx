import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import earbudsImage from "@/assets/earbuds.jpg";
import studioHeadphonesImage from "@/assets/studio-headphones.jpg";
import { Package, Wrench, Headphones } from "lucide-react";

const ForSaleSection = () => {
  const saleItems = [
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
      name: "Accessories",
      description: "Adapters, hygiene covers, carrying cases, and replacement cables.",
      price: "From 500 AMD",
      image: null,
      badge: "Accessories",
      badgeColor: "bg-muted text-muted-foreground",
      icon: Package
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">For Sale</h2>
          <p className="text-xl text-muted-foreground">Own your gear, pay once</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {saleItems.map((item) => (
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
                      <item.icon className="w-16 h-16 text-muted-foreground" />
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
                
                {item.name === "Refurbished Headphones" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm text-muted-foreground">30-day warranty</span>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForSaleSection;