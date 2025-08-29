import { GraduationCap, Shield, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WhyChooseUsSection = () => {
  const { t } = useLanguage();
  
  const icons = [GraduationCap, Shield, Phone, MapPin];
  const benefits = t('whyChooseUs.benefits') || [];

  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t('whyChooseUs.title')}</h2>
          <p className="text-xl text-muted-foreground">{t('whyChooseUs.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {Array.isArray(benefits) && benefits.map((benefit: any, index: number) => {
            const IconComponent = icons[index] || GraduationCap;
            return (
              <div key={index} className="flex items-start gap-4 p-6 bg-background rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;