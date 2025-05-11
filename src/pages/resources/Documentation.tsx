import React from 'react';
import { useTranslation } from 'react-i18next';
import { Book, FileText, Code, Terminal } from 'lucide-react';

const Documentation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Documentation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Getting Started */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Book className="text-primary-600 w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Getting Started</h2>
          </div>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Introduction to AI Smart Farming
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Setting Up Your Account
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Basic Navigation Guide
              </a>
            </li>
          </ul>
        </div>

        {/* Feature Guides */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FileText className="text-primary-600 w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Feature Guides</h2>
          </div>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Disease Detection Guide
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Using the AI Chatbot
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Weather Monitoring
              </a>
            </li>
          </ul>
        </div>

        {/* API Documentation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Code className="text-primary-600 w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">API Documentation</h2>
          </div>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                REST API Reference
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Authentication
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Rate Limits
              </a>
            </li>
          </ul>
        </div>

        {/* Troubleshooting */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Terminal className="text-primary-600 w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Troubleshooting</h2>
          </div>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Common Issues
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Contact Support
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Documentation;