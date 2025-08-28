import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How does booking work?",
      answer: "Send your name and phone through our booking form. We'll call you to confirm details and availability. You pay on pickup - no prepayment required."
    },
    {
      question: "Do I need to prepay?",
      answer: "No prepayment needed. Payment is made when you pick up your gear or on delivery. We accept cash or bank transfer."
    },
    {
      question: "Is there a deposit?",
      answer: "Sometimes for higher-value items, we may require a small deposit. We'll inform you of any deposit requirements during the confirmation call."
    },
    {
      question: "What do I need for student discount?",
      answer: "A valid student ID from any recognized educational institution. The discount is 15% off on all rental prices."
    },
    {
      question: "How long can I rent?",
      answer: "From 1 day to 30 days for standard rentals. Longer periods are available upon request - just ask us during the confirmation call."
    },
    {
      question: "Are rentals cleaned?",
      answer: "Yes, every device is professionally sanitized after each use. We include disposable hygiene covers where applicable for extra cleanliness."
    },
    {
      question: "What if I'm late returning?",
      answer: "Extra days are charged at the standard daily rate. If you need to extend your rental period, just let us know and we'll arrange it."
    },
    {
      question: "Do you deliver?",
      answer: "Yes, we offer delivery within Yerevan for a small fee. You can also pick up from our location. We'll confirm available options during the phone call."
    },
    {
      question: "Are refurbished items guaranteed?",
      answer: "Yes, all refurbished items come with a 30-day limited warranty against defects. Each item is thoroughly tested and cleaned before sale."
    },
    {
      question: "Legal & ethical use?",
      answer: "Absolutely. Our gear is designed for study, online classes, calls, and content creation. We do not support or condone exam cheating, surveillance, or any illegal use of our equipment."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">Everything you need to know about our service</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
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