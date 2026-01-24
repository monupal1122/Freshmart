import React, { useState, useEffect } from 'react';
import { Star, Heart, Share2, Minus, Plus, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';
export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { cart, setCart } = useContext(CartContext)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://grocery-backend-3pow.onrender.com/api/products`);
        const products = Array.isArray(res.data) ? res.data : res.data.products || [];
        const foundProduct = products.find(p => p._id === id);

        if (foundProduct) {
          setProduct(foundProduct);
          
          // Get related products from same category
          const related = products
            .filter(p => p._id !== id && p.category?._id === foundProduct.category?._id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    const existingProduct = cart.find((item) => item._id === product._id);

    let updatedCart;

    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity }];
    }

    setCart(updatedCart);
    console.log('Added to cart:', { product, quantity });
    toast.success(`Added ${quantity} ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    // Implement your buy now logic here
    console.log('Buy now:', { product, quantity });
    alert(`Proceeding to checkout with ${quantity} ${product.name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 mt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-emerald-600">Home</button>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-emerald-600 cursor-pointer">{product.category?.name || 'Category'}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-emerald-600 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-full shadow-lg transition ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50'}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 bg-white rounded-full shadow-lg text-gray-600 hover:bg-gray-50 transition">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {discount}% OFF
                </div>
              )}

              <div className="flex items-center justify-center h-96">
                <img
                  src={images[selectedImage] || '/placeholder-product.png'}
                  alt={product.name}
                  className="max-w-full max-h-96 object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.png';
                  }}
                />
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 bg-white rounded-xl p-2 border-2 transition ${selectedImage === idx ? 'border-emerald-500' : 'border-gray-100 hover:border-emerald-200'}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.png';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">
                  {product.category?.name || 'Product'}
                </span>
                {product.subcategory?.name && (
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                    {product.subcategory.name}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
              
              {/* Rating - Default rating for demo */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  4.5 (128 reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-emerald-600">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">₹{product.originalPrice}</span>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                In Stock
              </div>
            </div>

            {/* Description */}
            {product.desc && (
              <div className="border-t border-b border-gray-200 py-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.desc}</p>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl">
                  <button 
                    onClick={() => handleQuantityChange('decrease')}
                    className="p-3 hover:bg-gray-50 transition"
                  >
                    <Minus className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="px-6 font-semibold text-lg">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange('increase')}
                    className="p-3 hover:bg-gray-50 transition"
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Total: <span className="font-bold text-emerald-600 text-lg">₹{product.price * quantity}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-600 transition shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
             
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-xl">
                <Truck className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-xs font-semibold text-gray-700">Free Delivery</span>
                <span className="text-xs text-gray-500">Above ₹500</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-green-50 rounded-xl">
                <Shield className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-xs font-semibold text-gray-700">100% Fresh</span>
                <span className="text-xs text-gray-500">Guaranteed</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-purple-50 rounded-xl">
                <RotateCcw className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-xs font-semibold text-gray-700">Easy Return</span>
                <span className="text-xs text-gray-500">7 Days</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Product Information</h3>
              <div className="flex justify-between">
                <span className="text-gray-600">Product ID</span>
                <span className="font-semibold text-gray-900">#{product._id.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-semibold text-gray-900">{product.category?.name}</span>
              </div>
              {product.subcategory && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Subcategory</span>
                  <span className="font-semibold text-gray-900">{product.subcategory.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Added On</span>
                <span className="font-semibold text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="md:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6">
              {relatedProducts.map((item) => (
                <div 
                  key={item._id} 
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition cursor-pointer"
                >
                  <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-50">
                    <img 
                      src={item.images?.[0] || '/placeholder-product.png'}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.png';
                      }}
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600">₹{item.price}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Quick add:', item.name);
                      }}
                      className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}