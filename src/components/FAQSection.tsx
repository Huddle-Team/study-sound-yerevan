import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQSection = () => {
  const { t } = useLanguage();

  const faqQuestions = t('faq.questions') || [];

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t('faq.title')}</h2>
          <p className="text-xl text-muted-foreground">{t('faq.subtitle')}</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {Array.isArray(faqQuestions) && faqQuestions.map((faq: any, index: number) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;