import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plane as Plant, MessageSquare, CloudRain, Droplets, FlaskRound as Flask } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { state } = useAuth();

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {t('common.appName')}
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-100">
                Advanced AI technology to enhance farming practices, detect plant diseases, and optimize crop yields.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {state.isAuthenticated ? (
                  <Link to="/dashboard" className="btn bg-white text-primary-700 hover:bg-gray-100 text-center">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn bg-white text-primary-700 hover:bg-gray-100 text-center">
                      Get Started
                    </Link>
                    <Link to="/login" className="btn border border-white text-white hover:bg-white/10 text-center">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Smart Farming" 
                className="rounded-lg shadow-xl animate-fade-in max-h-96 object-cover w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive suite of AI-powered tools designed to revolutionize farming practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card hover:shadow-lg transform hover:-translate-y-1 transition-all">
              <div className="flex items-center mb-4">
                <Plant className="text-primary-600 w-8 h-8 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  {t('diseaseDetection.title')}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Upload plant images and receive instant AI-powered diagnosis of diseases and treatment recommendations.
              </p>
              <Link to="/disease-detection" className="text-primary-600 font-medium hover:text-primary-700 flex items-center">
                Analyze Your Plants <span className="ml-1">→</span>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="card hover:shadow-lg transform hover:-translate-y-1 transition-all">
              <div className="flex items-center mb-4">
                <MessageSquare className="text-primary-600 w-8 h-8 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  {t('chatbot.title')}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get instant answers to your farming questions, crop recommendations, and best practices from our AI assistant.
              </p>
              <Link to="/chatbot" className="text-primary-600 font-medium hover:text-primary-700 flex items-center">
                Chat with Assistant <span className="ml-1">→</span>
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="card hover:shadow-lg transform hover:-translate-y-1 transition-all">
              <div className="flex items-center mb-4">
                <CloudRain className="text-primary-600 w-8 h-8 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  {t('weather.title')}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Access real-time weather data and forecasts tailored for agricultural planning and decision making.
              </p>
              <Link to="/weather" className="text-primary-600 font-medium hover:text-primary-700 flex items-center">
                Check Weather <span className="ml-1">→</span>
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="card hover:shadow-lg transform hover:-translate-y-1 transition-all">
              <div className="flex items-center mb-4">
                <Droplets className="text-primary-600 w-8 h-8 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  {t('waterPrediction.title')}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Calculate optimal water requirements for your crops based on soil type, climate conditions, and crop variety.
              </p>
              <Link to="/water-prediction" className="text-primary-600 font-medium hover:text-primary-700 flex items-center">
                Calculate Water Needs <span className="ml-1">→</span>
              </Link>
            </div>

            {/* Feature 5 */}
            <div className="card hover:shadow-lg transform hover:-translate-y-1 transition-all">
              <div className="flex items-center mb-4">
                <Flask className="text-primary-600 w-8 h-8 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  {t('fertilizer.title')}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get personalized fertilizer recommendations based on your soil composition and crop requirements.
              </p>
              <Link to="/fertilizer" className="text-primary-600 font-medium hover:text-primary-700 flex items-center">
                Get Recommendations <span className="ml-1">→</span>
              </Link>
            </div>

            {/* Feature 6 */}
            <div className="card hover:shadow-lg transform hover:-translate-y-1 transition-all">
              <div className="flex items-center mb-4">
                <svg className="text-primary-600 w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.397 15.69a1 1 0 0 0-.075-1.272l-1.34-1.34-3 3 1.339 1.34a1 1 0 0 0 1.273.075l1.5-1a1 1 0 0 0 .303-.803Z"></path>
                  <path d="m17.275 11.371-3.707 3.707 2.121 2.121 3.707-3.707-2.121-2.121Z"></path>
                  <path d="M21.75 7.5a3.75 3.75 0 0 1-3.75 3.75c-.423 0-.828-.07-1.207-.199l-3.069 3.07 1.639 1.639a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414l2-2a1 1 0 0 1 1.414 0l1.639 1.639 3.07-3.07A3.764 3.764 0 0 1 14 6.25a3.75 3.75 0 0 1 7.5 1.25ZM18 7.5a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z"></path>
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">
                  Multi-Language Support
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Access all features in your preferred language including Hindi, Bengali, Telugu, and Tamil for better accessibility.
              </p>
              <button onClick={() => {}} className="text-primary-600 font-medium hover:text-primary-700 flex items-center">
                Change Language <span className="ml-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to leverage advanced AI technology for your farming needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary-700 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Create an Account</h3>
              <p className="text-gray-600 text-center">
                Sign up for free and get instant access to all our AI-powered farming tools and resources.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary-700 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Upload & Analyze</h3>
              <p className="text-gray-600 text-center">
                Upload plant images or input your farming data to get instant AI-powered analysis and recommendations.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary-700 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Implement Insights</h3>
              <p className="text-gray-600 text-center">
                Apply the personalized recommendations to improve crop yields, prevent diseases, and optimize resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Farmers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from farmers who have transformed their practices using our AI Smart Farming platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/2382895/pexels-photo-2382895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Farmer" 
                  className="w-14 h-14 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Rajesh Kumar</h4>
                  <p className="text-gray-600 text-sm">Rice Farmer, Bihar</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The disease detection feature saved my rice crop from a fungal infection. I uploaded images of affected plants and got immediate identification and treatment advice."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/4207909/pexels-photo-4207909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Farmer" 
                  className="w-14 h-14 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Lakshmi Devi</h4>
                  <p className="text-gray-600 text-sm">Vegetable Grower, Tamil Nadu</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The water prediction tool has helped me optimize irrigation for my vegetable farm. I'm using 30% less water while maintaining healthy crops and better yields."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/2403402/pexels-photo-2403402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Farmer" 
                  className="w-14 h-14 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Vijay Patel</h4>
                  <p className="text-gray-600 text-sm">Cotton Farmer, Gujarat</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The fertilizer recommendation system has been a game-changer. By following the AI suggestions, I've reduced my fertilizer costs and improved soil health at the same time."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of farmers using AI technology to improve yields, reduce costs, and farm more sustainably.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn bg-white text-primary-700 hover:bg-gray-100">
              Get Started Free
            </Link>
            <Link to="/disease-detection" className="btn border border-white text-white hover:bg-white/10">
              Try Disease Detection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;