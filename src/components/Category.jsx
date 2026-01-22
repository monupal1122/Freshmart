import React, { useState, useEffect } from "react";
import { Sparkles, ChevronRight, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ name, image, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Light pastel gradient backgrounds
  const gradients = [
    "from-pink-100 via-pink-50 to-white",
    "from-blue-100 via-blue-50 to-white",
    "from-purple-100 via-purple-50 to-white",
    "from-green-100 via-green-50 to-white",
    "from-yellow-100 via-yellow-50 to-white",
    "from-orange-100 via-orange-50 to-white",
    "from-teal-100 via-teal-50 to-white",
    "from-indigo-100 via-indigo-50 to-white",
    "from-rose-100 via-rose-50 to-white",
  ];

  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer h-full"
    >
      <div className={`relative bg-gradient-to-br ${randomGradient} rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-white/50 overflow-hidden h-full flex flex-col`}>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/30 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/30 rounded-full"></div>
        
        {/* Image Container - Fixed Height */}
        <div className="relative flex items-center justify-center mb-4 h-24">
          <div className={`absolute inset-0 bg-white/50 rounded-2xl transition-all duration-300 ${isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}`}></div>
          <img
            src={image || "/placeholder.png"}
            alt={name}
            className="relative w-20 h-20 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 z-10"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
          
          {/* Hover arrow */}
          <div className={`absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
            <ChevronRight className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        {/* Category Name - Fixed Height */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-center font-bold text-gray-800 group-hover:text-emerald-600 transition-colors text-sm leading-tight min-h-[2.5rem] flex items-center justify-center px-1">
            {name}
          </h3>

          {/* Shop Now Text */}
          <p className={`text-center text-xs text-emerald-600 font-semibold mt-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            Shop Now →
          </p>
        </div>
      </div>
    </div>
  );
};

const Category = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Add this

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://grocery-backend-3pow.onrender.com/api/categories"
        );
        const data = await response.json();

        // Filter active categories
        const activeCategories = data.filter(cat => cat.status !== false);
        setCategory(activeCategories);

        setCategory(data);

        console.log("Fetched categories:", data);
      } catch (error) {
        console.log("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  // Fix this function
  const handleCategoryClick = (categoryId) => {
    console.log("Navigating to category:", categoryId);
    navigate(`/shop?category=${categoryId}`); // This will navigate
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto max-w-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/50 rounded-2xl h-44"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-200/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200/20 to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-purple-600 px-5 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Sparkles className="w-4 h-4" />
            Explore Categories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse through our wide range of categories and find exactly what you need
          </p>
        </div>

        {/* Categories Grid */}
        {category.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
              {category.map((item) => (
                <CategoryCard
                  key={item._id}
                  name={item.name}
                  image={item.image}
                  onClick={() => handleCategoryClick(item._id)} // This passes the category ID
                />
              ))}
            </div>

            {/* Browse All Button */}
            
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Categories Found
            </h3>
            <p className="text-gray-600">
              Categories will appear here once they're added
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Category;