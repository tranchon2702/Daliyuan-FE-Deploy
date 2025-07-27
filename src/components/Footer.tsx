import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import logoImg from "@/assets/LogoDaliyuan.png";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <footer className="bg-dessert-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-white rounded-lg p-2 inline-block mb-3">
                <img 
                  src={logoImg} 
                  alt="Daliyuan Logo" 
                  className="h-16 w-auto object-contain" 
                />
              </div>
              <p className="text-sm opacity-80 tracking-wider uppercase">
                {t('footer.tagline')}
              </p>
            </div>
            <p className="text-sm opacity-80 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
              <Instagram className="h-5 w-5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.links.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">{t('footer.links.about')}</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">{t('footer.links.products')}</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">{t('footer.links.news')}</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">{t('footer.links.contact')}</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.support.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">{t('footer.support.delivery_policy')}</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">{t('footer.support.return_policy')}</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">{t('footer.support.payment_guide')}</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">{t('footer.support.faq')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contact.title')}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 opacity-80" />
                <span className="opacity-80">{t('footer.contact.address')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 opacity-80" />
                <span className="opacity-80">{t('footer.contact.phone')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 opacity-80" />
                <span className="opacity-80">{t('footer.contact.email')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-80">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;