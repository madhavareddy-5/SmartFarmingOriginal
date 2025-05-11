import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [openSection, setOpenSection] = useState<string | null>('general');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const faqData = {
    general: {
      title: 'General Questions',
      questions: [
        {
          id: 'q1',
          question: 'What is AI Smart Farming Assistant?',
          answer: 'AI Smart Farming Assistant is a comprehensive platform that uses artificial intelligence to help farmers make better decisions about their crops, detect diseases early, and optimize resource usage.'
        },
        {
          id: 'q2',
          question: 'How accurate is the disease detection feature?',
          answer: 'Our disease detection system has an accuracy rate of over 90% for most common crop diseases. However, we recommend using it as a tool to support, not replace, professional judgment.'
        }
      ]
    },
    account: {
      title: 'Account & Pricing',
      questions: [
        {
          id: 'q3',
          question: 'Is the service free to use?',
          answer: 'We offer a free basic tier with limited features. Premium features are available through our subscription plans.'
        },
        {
          id: 'q4',
          question: 'How do I create an account?',
          answer: 'You can create an account by clicking the "Register" button in the top right corner and following the simple registration process.'
        }
      ]
    },
    technical: {
      title: 'Technical Support',
      questions: [
        {
          id: 'q5',
          question: 'What should I do if the app isn\'t working?',
          answer: 'First, try refreshing your browser. If the issue persists, clear your cache and cookies. If you still experience problems, contact our support team.'
        },
        {
          id: 'q6',
          question: 'How do I update my device settings?',
          answer: 'Go to your profile settings by clicking your avatar in the top right corner, then select "Settings" from the dropdown menu.'
        }
      ]
    },
    features: {
      title: 'Features & Services',
      questions: [
        {
          id: 'q7',
          question: 'What file formats are supported for image upload?',
          answer: 'We support JPEG, PNG, and WebP image formats. The maximum file size is 10MB.'
        },
        {
          id: 'q8',
          question: 'How often is the weather data updated?',
          answer: 'Weather data is updated every hour to ensure you have the most current information for your location.'
        }
      ]
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Frequently Asked Questions
      </h1>

      <div className="space-y-6">
        {Object.entries(faqData).map(([key, section]) => (
          <div key={key} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={() => setOpenSection(openSection === key ? null : key)}
            >
              <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
              {openSection === key ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {openSection === key && (
              <div className="p-6 space-y-4">
                {section.questions.map((q) => (
                  <div key={q.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                    <button
                      className="w-full text-left flex items-center justify-between"
                      onClick={() => setOpenQuestion(openQuestion === q.id ? null : q.id)}
                    >
                      <h3 className="text-lg font-medium text-gray-800">{q.question}</h3>
                      {openQuestion === q.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0 ml-4" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0 ml-4" />
                      )}
                    </button>
                    
                    {openQuestion === q.id && (
                      <p className="mt-2 text-gray-600">{q.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Support Section */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Still have questions?
        </h2>
        <p className="text-gray-600 mb-6">
          Our support team is here to help you with any questions or concerns.
        </p>
        <a
          href="mailto:support@aismartfarming.com"
          className="btn btn-primary inline-flex items-center"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default FAQ;