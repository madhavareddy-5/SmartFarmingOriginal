import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Leaf, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="text-primary-600 w-6 h-6" />
              <span className="text-lg font-semibold text-gray-800">
                {t('common.appName')}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Empowering farmers with AI-driven tools for smarter farming decisions, 
              crop disease detection, and personalized recommendations.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary-600 transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="mailto:info@aismartfarming.com" className="text-gray-500 hover:text-primary-600 transition">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Features */}
          <div className="col-span-1">
            <h3 className="font-medium text-gray-800 mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/disease-detection" className="text-gray-600 hover:text-primary-600 text-sm transition">
                  {t('diseaseDetection.title')}
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-gray-600 hover:text-primary-600 text-sm transition">
                  {t('chatbot.title')}
                </Link>
              </li>
              <li>
                <Link to="/weather" className="text-gray-600 hover:text-primary-600 text-sm transition">
                  {t('weather.title')}
                </Link>
              </li>
              <li>
                <Link to="/water-prediction" className="text-gray-600 hover:text-primary-600 text-sm transition">
                  {t('waterPrediction.title')}
                </Link>
              </li>
              <li>
                <Link to="/fertilizer" className="text-gray-600 hover:text-primary-600 text-sm transition">
                  {t('fertilizer.title')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h3 className="font-medium text-gray-800 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/documentation" className="text-gray-600 hover:text-primary-600 text-sm transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/farming-guides" className="text-gray-600 hover:text-primary-600 text-sm transition">
                  Farming Guides
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-primary-600 text-sm transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary-600 text-sm transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div className="col-span-1">
            <h3 className="font-medium text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary-600 text-sm transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary-600 text-sm transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary-600 text-sm transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-600 text-sm transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} AI Smart Farming. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-4">
                <Link to="/privacy" className="text-gray-500 hover:text-primary-600 text-sm transition">
                  Privacy
                </Link>
                <Link to="/terms" className="text-gray-500 hover:text-primary-600 text-sm transition">
                  Terms
                </Link>
                <Link to="/cookies" className="text-gray-500 hover:text-primary-600 text-sm transition">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;