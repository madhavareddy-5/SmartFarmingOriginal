import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlaskRound as Flask, Calculator, ArrowRight, Loader, Save } from 'lucide-react';
import { fertilizerService } from '../services/api';
import { FertilizerRecommendation } from '../types';

const cropTypes = [
  'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Potato', 'Tomato', 'Onion', 'Chili', 'Soybean'
];

const soilTypes = [
  'Clay', 'Silt', 'Sandy', 'Loamy', 'Clayey Loam', 'Silty Loam', 'Sandy Loam', 'Black Soil', 'Red Soil', 'Alluvial Soil'
];

const FertilizerPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    cropType: '',
    soilType: '',
    nitrogen: 40,
    phosphorus: 30,
    potassium: 20,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FertilizerRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'nitrogen' || name === 'phosphorus' || name === 'potassium' 
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
      const response = await fertilizerService.getFertilizerRecommendation(formData);
      setResult(response.data);
    } catch (err: any) {
      console.error('Error calculating fertilizer recommendations:', err);
      setError(err.response?.data?.message || 'Failed to calculate fertilizer recommendations');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      cropType: '',
      soilType: '',
      nitrogen: 40,
      phosphorus: 30,
      potassium: 20,
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {t('fertilizer.title')}
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
                  {t('fertilizer.cropType')} *
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
                  {t('fertilizer.soilType')} *
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
              
              {/* Nitrogen Level */}
              <div>
                <label htmlFor="nitrogen" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('fertilizer.nitrogenLevel')}
                </label>
                <input
                  id="nitrogen"
                  name="nitrogen"
                  type="number"
                  min="0"
                  max="200"
                  step="1"
                  value={formData.nitrogen}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Current soil nitrogen level (kg/ha)</p>
              </div>
              
              {/* Phosphorus Level */}
              <div>
                <label htmlFor="phosphorus" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('fertilizer.phosphorusLevel')}
                </label>
                <input
                  id="phosphorus"
                  name="phosphorus"
                  type="number"
                  min="0"
                  max="200"
                  step="1"
                  value={formData.phosphorus}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Current soil phosphorus level (kg/ha)</p>
              </div>
              
              {/* Potassium Level */}
              <div>
                <label htmlFor="potassium" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('fertilizer.potassiumLevel')}
                </label>
                <input
                  id="potassium"
                  name="potassium"
                  type="number"
                  min="0"
                  max="200"
                  step="1"
                  value={formData.potassium}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Current soil potassium level (kg/ha)</p>
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
                    {t('fertilizer.calculate')}
                    <Calculator className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t('fertilizer.results')}
          </h2>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Flask className="text-primary-600 w-6 h-6 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">
                {t('fertilizer.recommendedFertilizers')}
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fertilizer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('fertilizer.amount')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nutrient Provided
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.recommendedFertilizers.map((fert, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {fert.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {fert.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {fert.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {fert.name.includes('Nitrogen') ? 'Nitrogen (N)' : 
                         fert.name.includes('Phosphate') ? 'Phosphorus (P)' : 
                         fert.name.includes('Potassium') || fert.name.includes('Potash') ? 'Potassium (K)' : 
                         'Multiple Nutrients'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <svg className="text-primary-600 w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.125 2.25h-4.5a1.875 1.875 0 0 0-1.875 1.875v7.5c0 1.036.84 1.875 1.875 1.875h.375a3.75 3.75 0 0 0 7.5 0h.375c1.035 0 1.875-.84 1.875-1.875v-7.5a1.875 1.875 0 0 0-1.875-1.875h-3.75Z"></path>
                <path d="M10.313 18.75a.75.75 0 0 1 .437.938A3.75 3.75 0 1 0 16.5 15v-1.5a.75.75 0 0 1 1.5 0V15a5.25 5.25 0 1 1-8.625 4.875.75.75 0 0 1 .938-.437Z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-gray-800">
                {t('fertilizer.recommendations')}
              </h3>
            </div>
            
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
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  These recommendations are based on your soil test values and the specific needs of {formData.cropType} in {formData.soilType} soil. For best results, consult with a local agricultural extension service or agronomist.
                </p>
              </div>
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
              <Save className="mr-2 h-5 w-5" />
              Save Recommendations
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FertilizerPage;