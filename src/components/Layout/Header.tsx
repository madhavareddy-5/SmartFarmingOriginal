import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Leaf, Menu, X, User, LogOut, Settings, Globe, Bell } from 'lucide-react';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { state, logout } = useAuth();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsLanguageOpen(false);
  };
  
  const toggleLanguage = () => {
    setIsLanguageOpen(!isLanguageOpen);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    window.location.href = '/login';
  };

  const selectLanguage = (code: string) => {
    changeLanguage(code);
    setIsLanguageOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="text-primary-600 w-8 h-8" />
            <span className="text-xl font-semibold text-gray-800 hidden md:block">
              {t('common.appName')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition">
              {t('common.home')}
            </Link>
            <Link to="/disease-detection" className="text-gray-700 hover:text-primary-600 font-medium transition">
              {t('diseaseDetection.title')}
            </Link>
            <Link to="/chatbot" className="text-gray-700 hover:text-primary-600 font-medium transition">
              {t('chatbot.title')}
            </Link>
            <Link to="/weather" className="text-gray-700 hover:text-primary-600 font-medium transition">
              {t('weather.title')}
            </Link>
            <Link to="/water-prediction" className="text-gray-700 hover:text-primary-600 font-medium transition">
              {t('waterPrediction.title')}
            </Link>
            <Link to="/fertilizer" className="text-gray-700 hover:text-primary-600 font-medium transition">
              {t('fertilizer.title')}
            </Link>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language selector */}
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-gray-100 transition"
                onClick={toggleLanguage}
              >
                <Globe className="w-5 h-5 text-gray-600" />
              </button>
              
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => selectLanguage(lang.code)}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          currentLanguage === lang.code ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth/profile actions */}
            {state.isAuthenticated ? (
              <div className="relative">
                <button 
                  className="p-1 rounded-full border-2 border-primary-500 hover:border-primary-600 transition"
                  onClick={toggleProfile}
                >
                  <span className="sr-only">Open user menu</span>
                  <User className="w-6 h-6 text-primary-600" />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu">
                      <div className="px-4 py-2 text-sm text-gray-500">
                        {state.user?.username}
                      </div>
                      <hr />
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {t('common.profile')}
                        </div>
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          {t('common.settings')}
                        </div>
                      </Link>
                      {state.user?.isAdmin && (
                        <Link 
                          to="/admin" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="flex items-center">
                            <Settings className="w-4 h-4 mr-2" />
                            {t('admin.title')}
                          </div>
                        </Link>
                      )}
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        <div className="flex items-center">
                          <LogOut className="w-4 h-4 mr-2" />
                          {t('common.logout')}
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="btn btn-outline py-1.5 px-3 text-sm">
                  {t('common.login')}
                </Link>
                <Link to="/register" className="btn btn-primary py-1.5 px-3 text-sm">
                  {t('common.register')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-3 pb-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary-600 font-medium transition p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.home')}
              </Link>
              <Link 
                to="/disease-detection" 
                className="text-gray-700 hover:text-primary-600 font-medium transition p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('diseaseDetection.title')}
              </Link>
              <Link 
                to="/chatbot" 
                className="text-gray-700 hover:text-primary-600 font-medium transition p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('chatbot.title')}
              </Link>
              <Link 
                to="/weather" 
                className="text-gray-700 hover:text-primary-600 font-medium transition p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('weather.title')}
              </Link>
              <Link 
                to="/water-prediction" 
                className="text-gray-700 hover:text-primary-600 font-medium transition p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('waterPrediction.title')}
              </Link>
              <Link 
                to="/fertilizer" 
                className="text-gray-700 hover:text-primary-600 font-medium transition p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('fertilizer.title')}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;