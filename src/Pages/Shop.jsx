import React, { useState, useRef, useEffect, useContext } from 'react'
import { Loader2 } from 'lucide-react'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const BASE_URL = "https://grocery-backend-3pow.onrender.com"

const Shop = () => {
  const [activeSubcategory, setActiveSubcategory] = useState('')
  const [subcategoriesData, setSubcategoriesData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [displayedProducts, setDisplayedProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const productsScrollRef = useRef(null)
  const loadingTimeoutRef = useRef(null)
  const navigate = useNavigate()
  const { cart, setCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');

    if (categoryFromUrl) {
      // If category is specified, fetch subcategories and products
      const fetchCategory = async (categoryId) => {
        try {
          const response = await fetch(
            `${BASE_URL}/api/subcategories/category/${categoryId}`
          );
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch subcategories');
          }

          // Filter active subcategories
          const activeSubcategories = data.filter(sub => sub.status !== false);
          setSubcategoriesData(activeSubcategories);

          console.log("Fetched categories:", data);

          if (data.length > 0) {
            const firstSubcategory = data[0]._id;
            setActiveSubcategory(firstSubcategory);
            // Fetch products for the first subcategory
            fetchProductsBySubcategory(firstSubcategory);
          }
        } catch (error) {
          console.log("Error fetching categories:", error);
          setSubcategoriesData([]);
          // If category fetch fails, fall back to all products
          fetchAllProducts();
        }
      };

      fetchCategory(categoryFromUrl);
    } else {
      // If no category is specified, fetch all products directly
      console.log("No category specified, fetching all products");
      setSubcategoriesData([]);
      setActiveSubcategory('');
      fetchAllProducts();
    }
  }, [])

  // Fetch products when active subcategory changes
  useEffect(() => {
    if (activeSubcategory) {
      fetchProductsBySubcategory(activeSubcategory);
    }
  }, [activeSubcategory])

  const fetchProductsBySubcategory = async (subcategoryId) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/products/subcategory/${subcategoryId}`);
      const data = await response.json();

      if (response.ok) {
        // Filter active products
        const activeProducts = data.filter(product => product.status !== false);
        setAllProducts(activeProducts);

        console.log("Fetched products:", data);
      } else {
        console.log("Error fetching products:", data.message);
        setAllProducts([]);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/products`);
      const data = await response.json();

      if (response.ok) {
        const products = Array.isArray(data) ? data : data.products || [];
        // Filter active products
        const activeProducts = products.filter(product => product.status !== false);
        setAllProducts(activeProducts);

        console.log("Fetched all products:", data);
      } else {
        console.log("Error fetching all products:", data.message);
        setAllProducts([]);
      }
    } catch (error) {
      console.log("Error fetching all products:", error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true)
    setDisplayedProducts([])

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }

    loadingTimeoutRef.current = setTimeout(() => {
      setDisplayedProducts(allProducts)
      setIsLoading(false)
    }, 500)

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [activeSubcategory, allProducts])

  const handleSubcategoryClick = (subcatId) => {
    if (subcatId !== activeSubcategory) {
      setActiveSubcategory(subcatId)
      if (productsScrollRef.current) {
        productsScrollRef.current.scrollTop = 0
      }
    }
  }

  const ProductCard = ({ product, index }) => (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className='bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 animate-fadeInUp border border-gray-100 hover:border-green-500 cursor-pointer'
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className='relative overflow-hidden group'>
        <img
          src={Array.isArray(product.images) ? product.images[0] : product.images?.split(',')[0]}
          alt={product.name}
          className='w-full h-24 object-cover group-hover:scale-110 transition-transform duration-500'
        />
        <div className='absolute top-1 right-1 bg-green-800 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-sm'>
          Fresh
        </div>
      </div>
      <div className='p-2'>
        <h3 className='font-medium text-xs mb-1 text-gray-800 line-clamp-1'>{product.name}</h3>
        <div className='flex items-center justify-between mb-1.5'>
          <p className='text-green-600 font-bold text-sm'>₹{product.price}</p>
          <span className='text-gray-400 text-xs line-through'>₹{Math.round(product.price * 1.2)}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!user) {
              toast.error('Please login to add items to cart');
              return;
            }

            const existingItem = cart.find(item => item._id === product._id);

            if (existingItem) {
              const updatedCart = cart.map(item =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              );
              setCart(updatedCart);
              toast.success(`${product.name} quantity updated in cart!`);
            } else {
              const newItem = { ...product, quantity: 1 };
              setCart([...cart, newItem]);
              toast.success(`${product.name} added to cart!`);
            }
          }}
          className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-1 rounded-md text-xs font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md'
        >
          Add to Cart
        </button>
      </div>
    </div>
  )

  const filteredSubcategories = subcategoriesData
  const currentSubcategory = filteredSubcategories.find(s => s._id === activeSubcategory)

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <div className='min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50'>
        {/* Mobile Header with Subcategories - Compact */}
        {filteredSubcategories.length > 0 && (
          <div className='md:hidden fixed top-0 left-0 right-0 bg-white shadow-lg z-40 border-b-2 border-green-500'>
            <div className='px-3 py-2'>
              <h1 className='font-bold text-sm text-gray-800 mb-2'>Select Category</h1>
              <div className='flex overflow-x-auto gap-2 pb-1 scrollbar-hide'>
                {filteredSubcategories.map(subcat => (
                  <div
                    key={subcat._id}
                    onClick={() => handleSubcategoryClick(subcat._id)}
                    className={`flex-shrink-0 w-16 cursor-pointer transition-all ${
                      activeSubcategory === subcat._id ? 'scale-105' : ''
                    }`}
                  >
                    <div className={`relative rounded-lg overflow-hidden ${
                      activeSubcategory === subcat._id
                        ? 'ring-3 ring-green-500 shadow-md'
                        : 'ring-1 ring-gray-200'
                    }`}>
                      <img
                        src={subcat.image}
                        alt={subcat.name}
                        className='w-16 h-16 object-cover'
                      />
                      {activeSubcategory === subcat._id && (
                        <div className='absolute inset-0 bg-black bg-opacity-20'></div>
                      )}
                    </div>
                    <p className={`text-xs text-center mt-0.5 font-medium truncate ${
                      activeSubcategory === subcat._id ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {subcat.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className='flex'>
          {/* Left Sidebar - Subcategories (Desktop Only) */}
          <div className='hidden md:block w-72 bg-white shadow-2xl fixed left-0 top-0 h-screen overflow-y-auto border-r-4 border-green-500 z-30'>
            <div className='p-5 bg-gradient-to-br from-green-800 to-emerald-800 text-white'>
              <h2 className='text-2xl font-bold mb-2'>Subcategory</h2>
              <p className='text-green-100 text-sm'>Browse by Subcategory</p>
            </div>
            
            <div className='space-y-2 p-4'>
              {filteredSubcategories.map(subcat => (
                <div
                  key={subcat._id}
                  onClick={() => handleSubcategoryClick(subcat._id)}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    activeSubcategory === subcat._id
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl scale-105 transform'
                      : 'hover:bg-green-50 hover:shadow-md border-2 border-transparent hover:border-green-200'
                  }`}
                >
                  <div className={`relative rounded-lg overflow-hidden ${
                    activeSubcategory === subcat._id ? 'ring-4 ring-white' : ''
                  }`}>
                    <img
                      src={subcat.image}
                      alt={subcat.name}
                      className='w-16 h-16 object-cover'
                      onError={(e) => {
                        e.target.src = '/empty.jpg';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${
                      activeSubcategory === subcat._id ? 'text-white' : 'text-gray-800'
                    }`}>
                      {subcat.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className='w-full md:ml-72  md:pt-0'>
            {/* Top Bar - Current Subcategory Name */}
            <div className='bg-gradient-to-r from-green-800 to-emerald-900 shadow-lg px-4 py-2 md:px-4 md:py-4 md:sticky md:top-0 z-20'>
              <h1 className='text-2xl md:text-3xl font-bold text-white'>
                {currentSubcategory?.name || 'Products'}
              </h1>
              <p className='text-xs md:text-sm text-green-100 mt-1 md:mt-2 flex items-center gap-2'>
                <span className='bg-white text-green-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full font-semibold text-xs'>
                  {displayedProducts.length}
                </span>
                items available
              </p>
            </div>

            {/* Products Grid - Scrollable */}
            <div
              ref={productsScrollRef}
              className='overflow-y-auto px-4 py-4 md:px-6 md:py-6 scrollbar-hide'
              style={{
                height: 'calc(100vh - 120px)',
                maxHeight: 'calc(100vh - 120px)'
              }}
            >
              {isLoading ? (
                <div className='flex flex-col items-center justify-center h-96'>
                  <div className='relative'>
                    <div className='animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto'></div>
                    <div className='absolute inset-0 rounded-full border-4 border-yellow-300 border-t-transparent animate-spin mx-auto' style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                  </div>
                  <p className='mt-6 text-gray-600 font-medium text-lg'>Loading fresh products...</p>
                  <p className='text-sm text-gray-500 mt-2'>Please wait while we fetch the best products for you</p>
                </div>
              ) : displayedProducts.length > 0 ? (
                <>
                  <div className='mb-6 bg-white rounded-xl p-4 shadow-sm border border-green-100'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className='bg-green-100 p-2 rounded-full'>
                          <span className='text-green-600 text-lg'>🛒</span>
                        </div>
                        <div>
                          <h3 className='font-semibold text-gray-800'>
                            {filteredSubcategories.length === 0 ? 'All Fresh Products' : 'Fresh Products Available'}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {filteredSubcategories.length === 0
                              ? 'Browse our complete collection of fresh groceries'
                              : 'All products are fresh and ready for delivery'
                            }
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-2xl font-bold text-green-600'>{displayedProducts.length}</div>
                        <div className='text-xs text-gray-500'>fresh items</div>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4'>
                    {displayedProducts.map((product, index) => (
                      <div
                        key={product._id}
                        className="animate-fadeInUp"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <ProductCard product={product} index={index} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className='flex flex-col items-center justify-center h-96'>
                  <div className='text-8xl mb-6 animate-bounce'>📦</div>
                  <h3 className='text-3xl font-semibold text-gray-600 mb-4'>No products found</h3>
                  <p className='text-xl text-gray-500 mb-8 text-center max-w-md'>
                    {filteredSubcategories.length > 0
                      ? "Try selecting a different category or check back later for new products"
                      : "We're working on adding more fresh products to our store. Check back soon!"}
                  </p>
                  {filteredSubcategories.length === 0 && (
                    <button
                      onClick={fetchAllProducts}
                      className='bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full hover:from-green-600 hover:to-emerald-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                    >
                      Refresh Products
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Shop