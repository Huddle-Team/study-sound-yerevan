import { Phone, MapPin, Clock, MessageCircle, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
                <a 
                  href={`tel:${t('contact.phone')}`}
                  className="text-sm hover:text-accent transition-colors cursor-pointer"
                >
                  {t('contact.phone')}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4" />
                <a 
                  href={t('contact.telegram')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-accent transition-colors cursor-pointer"
                >
                  Telegram
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4" />
                <a 
                  href={t('contact.whatsapp')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-accent transition-colors cursor-pointer"
                >
                  WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="w-4 h-4" />
                <a 
                  href={t('contact.instagram')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-accent transition-colors cursor-pointer"
                >
                  Instagram
                </a>
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
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            {t('footer.copyright')}
            <span className="block mt-1">{t('footer.tagline')}</span>
          </p>
          <div className="flex justify-center items-center mt-4">
            <a 
              href="https://huddlesys.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity flex justify-center"
            >
              <img 
                src="/copyright.png" 
                alt="Copyright" 
                className="h-auto w-1/4 cursor-pointer mx-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;