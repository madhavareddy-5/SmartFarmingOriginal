import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Target, Award, Heart } from 'lucide-react';

const AboutUs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About AI Smart Farming</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Empowering farmers with cutting-edge AI technology to revolutionize agricultural practices
          and promote sustainable farming for a better future.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Target className="text-primary-600 w-8 h-8 mr-3" />
            <h2 className="text-2xl font-semibold">Our Mission</h2>
          </div>
          <p className="text-gray-600">
            To make advanced agricultural technology accessible to farmers worldwide,
            helping them make data-driven decisions and improve crop yields while
            promoting sustainable farming practices.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Award className="text-primary-600 w-8 h-8 mr-3" />
            <h2 className="text-2xl font-semibold">Our Vision</h2>
          </div>
          <p className="text-gray-600">
            To create a world where every farmer has access to AI-powered tools
            and insights, leading to improved food security, sustainable agriculture,
            and prosperous farming communities.
          </p>
        </div>
      </div>


      {/* Values */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="text-primary-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Farmer First</h3>
            <p className="text-gray-600">
              We prioritize farmers' needs and ensure our solutions are accessible and practical.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="text-primary-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Excellence</h3>
            <p className="text-gray-600">
              We strive for excellence in our technology and service delivery.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="text-primary-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600">
              We build and support farming communities through collaboration.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Target className="text-primary-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p className="text-gray-600">
              We continuously innovate to provide cutting-edge solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-6">
          Have questions or want to learn more about our services?
        </p>
        <a
          href="mailto:contact@aismartfarming.com"
          className="btn btn-primary inline-flex items-center"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default AboutUs;