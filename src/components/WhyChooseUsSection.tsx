import { GraduationCap, Shield, Phone, MapPin } from "lucide-react";

const WhyChooseUsSection = () => {
  const benefits = [
    {
      icon: GraduationCap,
      title: "Student pricing & discounts",
      description: "15% off rentals with valid student ID"
    },
    {
      icon: Shield,
      title: "Cleaned & sanitized after every use",
      description: "Professional cleaning with hygiene covers included"
    },
    {
      icon: Phone,
      title: "Quick phone confirmation — no prepayment",
      description: "Just send your name and phone, we'll call to confirm"
    },
    {
      icon: MapPin,
      title: "Local support in Yerevan",
      description: "Pickup, delivery, and local customer service"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose SpyTech?</h2>
          <p className="text-xl text-muted-foreground">Trusted by people across Yerevan</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-4 p-6 bg-background rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;