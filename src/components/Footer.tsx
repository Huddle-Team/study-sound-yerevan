import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{t('common.brand')}</h3>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span>{t('common.legalUse')}</span>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('common.contact')}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{t('footer.phone')}</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{t('footer.telegram')}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span className="text-sm">
                  {t('footer.address')}
                  <br />
                  <span className="text-xs text-primary-foreground/60">
                    {t('footer.addressNote')}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Hours & Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('common.hours')}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4" />
                <span className="text-sm">24/7</span>
              </div>
              <div className="pt-4">
                <h5 className="text-sm font-semibold mb-2">{t('footer.language')}</h5>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            {t('footer.copyright')}
            <span className="block mt-1">{t('footer.tagline')}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;