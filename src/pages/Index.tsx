import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import RentalsSection from "@/components/RentalsSection";
import ForSaleSection from "@/components/ForSaleSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import BookingForm from "@/components/BookingForm.tsx";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <RentalsSection />
      <ForSaleSection />
      <WhyChooseUsSection />
      <BookingForm />
      <FAQSection />
      <Footer />
    </main>
  );
};

export default Index;
