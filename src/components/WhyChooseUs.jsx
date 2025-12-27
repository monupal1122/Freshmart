import React from "react";
import { ShoppingCart, Truck, Shield, Clock, Leaf, Award } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'
const WhyChooseUs = () => {
    // const navigate = useNavigate
  const features = [
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Easy to Order",
      description: "You only need a few steps in ordering food and it has easy to contact with Literature",
      color: "from-orange-400 to-orange-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fastest Delivery",
      description: "Delivery that is always ontime even faster simply random text. It has roots in imilitudine of Literature",
      color: "from-blue-400 to-blue-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payment",
      description: "Payment is secure and we protect your data with encryption and secure servers",
      color: "from-green-400 to-green-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Service",
      description: "We provide round the clock customer support for all your needs",
      color: "from-purple-400 to-purple-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "100% Fresh",
      description: "All our products are fresh and organic, delivered straight from farms",
      color: "from-teal-400 to-teal-500",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Best Quality",
      description: "Premium quality products that meet the highest standards",
      color: "from-pink-400 to-pink-500",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-500"
    }
  ];
  

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We provide the best service and quality products to make your shopping experience memorable
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105"
            >
              {/* Icon */}
              <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className={feature.iconColor}>
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative Element */}
              <div className={`absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br ${feature.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            </div>
          ))}
        </div>

        {/* Deal of the Day Section */}
        <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left - Image */}
            <div className="relative h-full min-h-[300px] md:min-h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800"
                alt="Fresh Vegetables"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x600?text=Fresh+Vegetables";
                }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-green-50/90"></div>
            </div>

            {/* Right - Content */}
            <div className="p-8 md:p-12 relative z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                <Clock className="w-4 h-4" />
                Weekly Offer
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Check <span className="text-emerald-600">Deal Of The Day</span>
              </h2>
              
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                Grab a deal of these foods where everyone has a favourite style, 
                And fried these veg tell Literature
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to={'/shop'}>
                <button className="bg-emerald-500 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Shop Now
                </button>
                </Link>
                <button className="bg-white text-emerald-600 px-8 py-3 rounded-full font-bold border-2 border-emerald-500 hover:bg-emerald-50 transition-all duration-300 shadow-lg">
                  View Deals
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-emerald-200">
                <div>
                  <div className="text-3xl font-bold text-emerald-600">50+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600">2K+</div>
                  <div className="text-sm text-gray-600">Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600">100%</div>
                  <div className="text-sm text-gray-600">Fresh</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;