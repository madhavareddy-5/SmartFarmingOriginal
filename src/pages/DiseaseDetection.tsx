import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, Camera, ArrowRight, Image, Loader } from 'lucide-react';
import { diseaseDetectionService } from '../services/api';

const DiseaseDetection: React.FC = () => {
  const { t } = useTranslation();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      // Reset previous results and error
      setResult(null);
      setError(null);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check if file is an image
      if (!droppedFile.type.match('image.*')) {
        setError(t('diseaseDetection.onlyImages'));
        return;
      }
      
      setImage(droppedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
      
      // Reset previous results and error
      setResult(null);
      setError(null);
    }
  };
  
  const removeImage = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      setError(t('diseaseDetection.noImage'));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await diseaseDetectionService.detectDisease(image, description);
      setResult(response.data);
    } catch (err: any) {
      console.error('Error detecting disease:', err);
      setError(err.response?.data?.message || t('diseaseDetection.error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    removeImage();
    setDescription('');
    setResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {t('diseaseDetection.title')}
      </h1>
      
      {!result ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            {/* Image upload area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('diseaseDetection.uploadImage')}
              </label>
              
              {!preview ? (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      {t('diseaseDetection.dragDrop')}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
              
              {error && (
                <p className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>
            
            {/* Description field */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Plant Description (Optional)
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide any additional information about the plant or symptoms..."
                className="input-field"
              />
            </div>
            
            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!image || isLoading}
                className="btn btn-primary flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin mr-2 h-5 w-5" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    {t('diseaseDetection.analyzeImage')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t('diseaseDetection.results')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <img 
                src={preview!} 
                alt="Analyzed Plant" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {t('diseaseDetection.disease')}
                </h3>
                <p className="text-gray-700">
                  {result.detectedDisease || t('diseaseDetection.noDisease')}
                </p>
                
                {result.confidence && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      {t('diseaseDetection.confidence')}: {Math.round(result.confidence * 100)}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.round(result.confidence * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {t('diseaseDetection.recommendations')}
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">
                    {result.recommendations || t('diseaseDetection.healthyPlant')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-outline flex items-center"
            >
              <Camera className="mr-2 h-5 w-5" />
              {t('diseaseDetection.uploadAnother')}
            </button>
            
            <button
              type="button"
              onClick={() => {/* TODO: Save result to history */}}
              className="btn btn-primary flex items-center"
            >
              <Image className="mr-2 h-5 w-5" />
              Save to History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;