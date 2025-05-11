import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, Sun, Cloud, Droplets } from 'lucide-react';

const FarmingGuides: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Farming Guides</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Crop Guides */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Sprout className="text-primary-600 w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Crop Guides</h2>
          </div>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Rice Cultivation Guide
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Wheat Growing Tips
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Cotton Farming Guide
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Vegetable Growing Guide
              </a>
            </li>
          </ul>
        </div>

        {/* Seasonal Guides */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Sun className="text-primary-600 w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Seasonal Guides</h2>
          </div>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Summer Crop Planning
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Monsoon Farming Tips
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Winter Crop Guide
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Year-round Planning
              </a>
            </li>
          </ul>
        </div>

        {/* Weather Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Cloud className="text-primary-600 w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Weather Management</h2>
          </div>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Drought Management
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Flood Protection
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Frost Protection
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Storm Preparation
              </a>
            </li>
          </ul>
        </div>

        {/* Irrigation Guides */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Droplets className="text-primary-600 w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Irrigation Guides</h2>
          </div>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Drip Irrigation
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Sprinkler Systems
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Water Conservation
              </a>
            </li>
            <li>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Smart Irrigation
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FarmingGuides;