import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/e6dd464b-2ef6-448d-bfd1-275f6f65b1ed.png" 
                alt="SpyTech Student Audio Logo" 
                className="w-12 h-12"
              />
              <h3 className="text-2xl font-bold">SpyTech Student Audio</h3>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Affordable, legal audio gear for students in Yerevan. Rent or buy headphones for study, calls, and content creation.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span>Legal & ethical use only</span>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+374 XX XXX XXX</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@spytech.am</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">Telegram & WhatsApp</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span className="text-sm">Yerevan<br /><span className="text-xs text-primary-foreground/60">(exact pickup point shared during confirmation)</span></span>
              </div>
            </div>
          </div>

          {/* Hours & Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hours & Links</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Mon–Sat<br />11:00–19:00</span>
              </div>
              <div className="pt-4 space-y-2">
                <div><a href="#" className="text-sm hover:text-accent transition-colors">Terms of Service</a></div>
                <div><a href="#" className="text-sm hover:text-accent transition-colors">Privacy Policy</a></div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2024 SpyTech Student Audio. All rights reserved. 
            <span className="block mt-1">Serving students in Yerevan with quality audio gear.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;