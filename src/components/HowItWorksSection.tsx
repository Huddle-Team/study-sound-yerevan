import { Search, Phone, MapPin, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorksSection = () => {
  const { t } = useLanguage();
  
  const icons = [Search, Phone, MapPin, CreditCard];
  const steps = t('howItWorks.steps') || [];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t('howItWorks.title')}</h2>
          <p className="text-xl text-muted-foreground">{t('howItWorks.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.isArray(steps) && steps.map((step: any, index: number) => {
            const IconComponent = icons[index] || Search;
            return (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;