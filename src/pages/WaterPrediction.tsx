import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, Calculator, PieChart, ArrowRight, Loader } from 'lucide-react';
import { waterPredictionService } from '../services/api';
import { WaterPrediction } from '../types';

const cropTypes = [
  'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Potato', 'Tomato', 'Onion', 'Chili', 'Soybean'
];

const soilTypes = [
  'Clay', 'Silt', 'Sandy', 'Loamy', 'Clayey Loam', 'Silty Loam', 'Sandy Loam', 'Black Soil', 'Red Soil', 'Alluvial Soil'
];

const WaterPredictionPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    cropType: '',
    soilType: '',
    area: 1,
    temperature: 25,
    humidity: 50,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WaterPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'area' || name === 'temperature' || name === 'humidity' 
        ? parseFloat(value) 
        : value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cropType || !formData.soilType) {
      setError('Please fill all required fields');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await waterPredictionService.predictWaterRequirement(formData);
      setResult(response.data);
    } catch (err: any) {
      console.error('Error calculating water requirement:', err);
      setError(err.response?.data?.message || 'Failed to calculate water requirements');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      cropType: '',
      soilType: '',
      area: 1,
      temperature: 25,
      humidity: 50,
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {t('waterPrediction.title')}
      </h1>
      
      {!result ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Crop Type */}
              <div>
                <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('waterPrediction.cropType')} *
                </label>
                <select
                  id="cropType"
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select crop type</option>
                  {cropTypes.map((crop) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
              
              {/* Soil Type */}
              <div>
                <label htmlFor="soilType" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('waterPrediction.soilType')} *
                </label>
                <select
                  id="soilType"
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select soil type</option>
                  {soilTypes.map((soil) => (
                    <option key={soil} value={soil}>{soil}</option>
                  ))}
                </select>
              </div>
              
              {/* Area */}
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('waterPrediction.area')} *
                </label>
                <input
                  id="area"
                  name="area"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              {/* Temperature */}
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('waterPrediction.temperature')} *
                </label>
                <input
                  id="temperature"
                  name="temperature"
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              {/* Humidity */}
              <div>
                <label htmlFor="humidity" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('waterPrediction.humidity')} *
                </label>
                <input
                  id="humidity"
                  name="humidity"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.humidity}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin mr-2 h-5 w-5" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    {t('waterPrediction.calculate')}
                    <Calculator className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t('waterPrediction.results')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center justify-center">
                  <Droplets className="text-blue-500 w-16 h-16" />
                </div>
                <h3 className="text-xl font-bold text-center my-4">
                  {t('waterPrediction.requirement')}
                </h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {result.waterRequirement.toLocaleString()} {t('waterPrediction.liters')}
                  </p>
                  <p className="text-gray-600 mt-2">
                    ({(result.waterRequirement / 1000).toLocaleString()} {t('waterPrediction.cubicMeters')})
                  </p>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    For {formData.area} hectares of {formData.cropType}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 p-6 rounded-lg h-full">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Water Usage Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">
                      {t('waterPrediction.frequency')}
                    </h4>
                    <p className="text-gray-800 font-medium">
                      {result.frequency}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">
                      Crop Water Needs
                    </h4>
                    <p className="text-gray-800 font-medium">
                      {formData.cropType}: {result.waterRequirement / formData.area} liters per hectare
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">
                      Soil Retention Factor
                    </h4>
                    <p className="text-gray-800 font-medium">
                      {formData.soilType} soil: Medium water retention
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              {t('waterPrediction.recommendations')}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-gray-700">
                {result.recommendations.split('\n').map((recommendation, index) => (
                  <li key={index} className="flex">
                    <span className="mr-2">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-outline flex items-center"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Calculate Another
            </button>
            
            <button
              type="button"
              onClick={() => {/* TODO: Save result */}}
              className="btn btn-primary flex items-center"
            >
              <PieChart className="mr-2 h-5 w-5" />
              Save Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterPredictionPage;