import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, User, Tag } from 'lucide-react';

const Blog: React.FC = () => {
  const { t } = useTranslation();

  const blogPosts = [
    {
      id: 1,
      title: "AI in Agriculture: Transforming Traditional Farming",
      excerpt: "Discover how artificial intelligence is revolutionizing farming practices and improving crop yields.",
      image: "https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg",
      date: "2025-03-15",
      author: "Dr. Sarah Johnson",
      category: "Technology"
    },
    {
      id: 2,
      title: "Sustainable Farming Practices for the Future",
      excerpt: "Learn about eco-friendly farming methods that help preserve our environment while maintaining productivity.",
      image: "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg",
      date: "2025-03-12",
      author: "Michael Chen",
      category: "Sustainability"
    },
    {
      id: 3,
      title: "Smart Irrigation Systems: A Complete Guide",
      excerpt: "Everything you need to know about implementing smart irrigation systems in your farm.",
      image: "https://images.pexels.com/photos/2132252/pexels-photo-2132252.jpeg",
      date: "2025-03-10",
      author: "Priya Patel",
      category: "Water Management"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <User className="w-4 h-4 mr-1" />
                <span>{post.author}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                <a href="#" className="text-gray-800 hover:text-primary-600">
                  {post.title}
                </a>
              </h2>
              <p className="text-gray-600 mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-primary-600">
                  <Tag className="w-4 h-4 mr-1" />
                  <span>{post.category}</span>
                </div>
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  Read More →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;