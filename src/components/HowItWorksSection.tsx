import { Search, Phone, MapPin, CreditCard } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Search,
      title: "Choose your gear",
      description: "Browse our rental and sale options"
    },
    {
      icon: Phone,
      title: "Send your name & phone",
      description: "Quick booking form, no payment required"
    },
    {
      icon: MapPin,
      title: "We call to confirm pickup/delivery",
      description: "We'll confirm availability and arrange meetup"
    },
    {
      icon: CreditCard,
      title: "Pay on pickup",
      description: "Cash or transfer when you receive your gear"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">Simple booking process, no prepayment needed</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary rounded-xl px-6 py-4">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-foreground font-medium">Student ID = 15% discount on rentals</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;