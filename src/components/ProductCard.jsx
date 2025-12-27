import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={
            Array.isArray(product.images)
              ? product.images[0]
              : product.images?.split(",")[0] || "/placeholder.png"
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "/placeholder.png";
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {discount > 0 && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {discount}% OFF
            </div>
          )}
          <div className="flex-1"></div>
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
              isFavorite
                ? "bg-red-500 text-white scale-110"
                : "bg-white/80 text-gray-600 hover:bg-white"
            } ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Quick View Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full hover:bg-white transition-all duration-300 shadow-xl transform hover:scale-110"
              title="Quick View"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-emerald-500 text-white px-3 py-2 rounded-full font-bold hover:bg-emerald-100 transition-all duration-300 shadow-xl flex items-center gap-2 transform hover:scale-105"
            >
              <ShoppingCart className="w-4 h-4" />
              Quick Add
            </button>
          </div>
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
              Only {product.stock} left!
            </span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        {(product.category?.name || product.subcategory?.name) && (
          <div className="flex items-center gap-2 flex-wrap">
            {product.category?.name && (
              <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-semibold">
                {product.category.name}
              </span>
            )}
            {product.subcategory?.name && (
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-semibold">
                {product.subcategory.name}
              </span>
            )}
          </div>
        )}

        <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-emerald-600 transition-colors text-sm md:text-base">
          {product.name}
        </h3>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.5)</span>
        </div>

        {product.desc && (
          <p className="text-xs text-gray-500 line-clamp-2">{product.desc}</p>
        )}

        {product.quantity && (
          <p className="text-xs text-gray-600 font-medium">📦 {product.quantity}</p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-bold text-emerald-600">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {discount > 0 && (
              <span className="text-xs text-emerald-600 font-semibold">
                Save ₹{product.originalPrice - product.price}
              </span>
            )}
          </div>
          
          <button
            onClick={addToCart}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 ${
              product.stock === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-emerald-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ProductCard;