import React from 'react';
import { ShoppingBag, Smartphone, Star, Download } from 'lucide-react';

export default function GroceryAppBanner() {
  const handleDownloadClick = () => {
    // Replace with your actual Play Store URL
    window.open('https://play.google.com/store/apps/details?id=your.app.package', '_blank');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Main Large Banner - Clickable */}
      <div 
        onClick={handleDownloadClick}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl mb-8"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Animated decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4"></div>
        
        {/* Floating vegetables/fruits icons */}
        <div className="absolute top-10 left-20 text-6xl animate-bounce">🥕</div>
        <div className="absolute bottom-20 left-32 text-5xl animate-bounce" style={{animationDelay: '0.5s'}}>🍎</div>
        <div className="absolute top-32 right-40 text-6xl animate-bounce" style={{animationDelay: '1s'}}>🥬</div>
        
        <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-16 items-center min-h-[500px]">
          {/* Left Content */}
          <div className="text-white space-y-6 z-10">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-emerald-900 px-5 py-2 rounded-full text-sm font-bold mb-4">
              <Download className="w-4 h-4" />
              Download Now
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Grocery Applications
            </h1>
            
            <p className="text-xl md:text-2xl text-emerald-50 font-medium">
              Fresh groceries delivered to your doorstep in minutes!
            </p>
            
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-white">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-lg">20+ Screens & UI Kit Design</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-lg">Easy Editable & User Friendly</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Star className="w-5 h-5" />
                </div>
                <span className="text-lg">Best Shopping Experience</span>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button className="bg-white text-emerald-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition shadow-xl flex items-center gap-2">
                <Download className="w-5 h-5" />
                Get the App
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span className="text-white font-semibold">4.8 Rating</span>
              </div>
              <div className="text-white font-semibold">
                10K+ Downloads
              </div>
            </div>
          </div>

          {/* Right - Phone Mockups */}
          <div className="relative hidden md:block z-10">
            <div className="relative w-full h-[450px] flex items-center justify-center">
              {/* Phone mockup 1 - Front */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-[520px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-800 overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
                <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-white p-4">
                  <div className="text-center space-y-4 mt-8">
                    <div className="text-6xl"></div>
                    <div className="font-bold text-xl text-gray-800">Categories</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-3xl mb-1">🍎</div>
                        <div className="text-xs font-semibold">Fruits</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-3xl mb-1">🥬</div>
                        <div className="text-xs font-semibold">Vegetables</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-3xl mb-1">🥤</div>
                        <div className="text-xs font-semibold">Drinks</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-3xl mb-1">🍞</div>
                        <div className="text-xs font-semibold">Bakery</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone mockup 2 - Behind */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-[520px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-800 overflow-hidden transform rotate-[5deg] hover:rotate-0 transition-transform duration-300">
                <div className="w-full h-full bg-gradient-to-br from-white to-emerald-50 p-4">
                  <div className="space-y-4 mt-8">
                    <div className="bg-emerald-100 rounded-xl p-4">
                      <div className="text-xs font-bold text-emerald-800 mb-2">50% OFF</div>
                      <div className="text-sm font-semibold">On Orders</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">🍊</div>
                      <div className="flex-1">
                        <div className="text-xs font-bold">Orange</div>
                        <div className="text-xs text-gray-500">₹199</div>
                      </div>
                      <button className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs">Add</button>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">🍌</div>
                      <div className="flex-1">
                        <div className="text-xs font-bold">Banana</div>
                        <div className="text-xs text-gray-500">₹49</div>
                      </div>
                      <button className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs">Add</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-emerald-900 px-8 py-4 rounded-full font-bold text-2xl shadow-2xl animate-bounce z-20">
                50% OFF
              </div>
            </div>
          </div>

          {/* Mobile view - Show single phone */}
          <div className="md:hidden flex justify-center">
            <div className="w-48 h-96 bg-white rounded-[2rem] shadow-2xl border-4 border-gray-800 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-white p-3 flex items-center justify-center">
                <ShoppingBag className="w-20 h-20 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Click indicator */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-emerald-700 text-sm font-semibold flex items-center gap-2 animate-pulse">
          <Download className="w-4 h-4" />
          Click to Download
        </div>
      </div>

      {/* Info Section Below */}
      <div className="text-center mt-6">
        <p className="text-gray-600 text-lg">
          Available on Google Play Store
        </p>
        <div className="flex justify-center gap-2 mt-2">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        </div>
      </div>
    </div>
  );
}