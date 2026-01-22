import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import { toast } from 'react-toastify'
import { User, Package, MapPin, LogOut, X, ChevronRight, Calendar, Phone, Mail, Home, Briefcase, Star, Award } from 'lucide-react'

const AccountModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile')
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(false)

  const { user, authToken, logout } = useContext(AuthContext)
  const { clearCart } = useContext(CartContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen && user) {
      if (activeTab === 'orders') {
        fetchOrders()
      } else if (activeTab === 'addresses') {
        fetchAddresses()
      }
    }
  }, [isOpen, activeTab, user])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://grocery-backend-3pow.onrender.com/api/order/my`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })

      const data = await response.json()
      console.log("data iddar hai ", data);

      if (response.ok) {
        setOrders(data.orders.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAddresses = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://grocery-backend-3pow.onrender.com/api/address', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })

      const data = await response.json()
      console.log("address yeah hai", data);

      if (response.ok) {
        setAddresses(data.addresses)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    clearCart()
    toast.success('Logged out successfully')
    onClose()
    navigate('/')
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-amber-500', text: 'Pending', icon: '⏳', ring: 'ring-amber-200', bg: 'bg-amber-50', textColor: 'text-amber-700' },
      confirmed: { color: 'bg-blue-500', text: 'Confirmed', icon: '✓', ring: 'ring-blue-200', bg: 'bg-blue-50', textColor: 'text-blue-700' },
      shipped: { color: 'bg-purple-500', text: 'Shipped', icon: '🚚', ring: 'ring-purple-200', bg: 'bg-purple-50', textColor: 'text-purple-700' },
      delivered: { color: 'bg-green-500', text: 'Delivered', icon: '✓', ring: 'ring-green-200', bg: 'bg-green-50', textColor: 'text-green-700' },
      cancelled: { color: 'bg-red-500', text: 'Cancelled', icon: '✕', ring: 'ring-red-200', bg: 'bg-red-50', textColor: 'text-red-700' }
    }
    return configs[status] || configs.pending
  }

  if (!isOpen) return null

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package, badge: orders.length },
    { id: 'addresses', label: 'Addresses', icon: MapPin }
  ]

  // Generate avatar from username
  const avatarUrl = user?.username 
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=10b981&color=fff&size=200&bold=true`
    : 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=200'

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className='fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn'>
        {/* Backdrop */}
        <div 
          className='absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm'
          onClick={onClose}
        />

        {/* Modal */}
        <div className='relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-slideUp'>
          {/* Gradient Header */}
          <div className='relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-4 sm:p-8'>
            <div className='absolute inset-0 bg-black/10'></div>
            <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/20'></div>
            
            <div className='relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4'>
              <div className='flex flex-col sm:flex-row items-center gap-4'>
                <div className='relative'>
                  <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-4 ring-white/30 shadow-xl'>
                    <img src={avatarUrl} alt={user?.username} className='w-full h-full object-cover' />
                  </div>
                  <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white shadow-lg'></div>
                </div>
                <div className='text-white text-center sm:text-left'>
                  <h2 className='text-xl sm:text-3xl font-bold mb-1'>{user?.username || 'User'}</h2>
                  <p className='text-emerald-50 text-xs sm:text-sm flex items-center gap-2 justify-center sm:justify-start'>
                    <Mail className='w-3 h-3 sm:w-4 sm:h-4' />
                    {user?.email || 'email@example.com'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className='absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 text-white hover:bg-white/20 p-2 rounded-full transition-all duration-300 hover:rotate-90'
              >
                <X className='w-5 h-5 sm:w-6 sm:h-6' />
              </button>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row flex-1 overflow-hidden'>
            {/* Desktop Sidebar */}
            <div className='hidden sm:flex w-64 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex-col'>
              <div className='p-6 space-y-2 flex-1'>
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <Icon className={`w-5 h-5 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                        <span className='font-semibold'>{tab.label}</span>
                      </div>
                      {tab.badge > 0 && (
                        <span className={`${isActive ? 'bg-white text-emerald-600' : 'bg-emerald-500 text-white'} text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
              
              <div className='p-6 border-t border-gray-200'>
                <button
                  onClick={handleLogout}
                  className='w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 group font-semibold'
                >
                  <LogOut className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile Tabs */}
            <div className='sm:hidden w-full border-b border-gray-200 bg-white'>
              <div className='flex overflow-x-auto scrollbar-hide p-3 gap-2'>
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 text-sm ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className='w-4 h-4' />
                      <span className='font-semibold whitespace-nowrap'>{tab.label}</span>
                      {tab.badge > 0 && (
                        <span className={`${isActive ? 'bg-white text-emerald-600' : 'bg-emerald-500 text-white'} text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div className='flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50'>
              <div className='p-4 sm:p-8'>
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className='space-y-4 sm:space-y-6 animate-slideIn'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2'>
                        <User className='w-5 h-5 sm:w-6 sm:h-6 text-emerald-500' />
                        Profile Information
                      </h3>
                    </div>

                    <div className='grid gap-4 sm:gap-6'>
                      {/* Name Card */}
                      <div className='bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
                        <div className='flex items-center gap-3 mb-3'>
                          <div className='p-2 bg-emerald-50 rounded-lg'>
                            <User className='w-4 h-4 sm:w-5 sm:h-5 text-emerald-600' />
                          </div>
                          <label className='text-xs sm:text-sm font-semibold text-gray-600'>Full Name</label>
                        </div>
                        <p className='text-base sm:text-lg font-semibold text-gray-900'>{user?.username || 'N/A'}</p>
                      </div>

                      {/* Email Card */}
                      <div className='bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
                        <div className='flex items-center gap-3 mb-3'>
                          <div className='p-2 bg-blue-50 rounded-lg'>
                            <Mail className='w-4 h-4 sm:w-5 sm:h-5 text-blue-600' />
                          </div>
                          <label className='text-xs sm:text-sm font-semibold text-gray-600'>Email Address</label>
                        </div>
                        <p className='text-base sm:text-lg font-semibold text-gray-900 break-words'>{user?.email || 'N/A'}</p>
                      </div>

                      {/* Member Since Card */}
                      <div className='bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
                        <div className='flex items-center gap-3 mb-3'>
                          <div className='p-2 bg-purple-50 rounded-lg'>
                            <Calendar className='w-4 h-4 sm:w-5 sm:h-5 text-purple-600' />
                          </div>
                          <label className='text-xs sm:text-sm font-semibold text-gray-600'>Member Since</label>
                        </div>
                        <p className='text-base sm:text-lg font-semibold text-gray-900'>
                          {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>

                      {/* Loyalty Points Card */}
                      <div className='bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl p-4 sm:p-6 shadow-xl text-white'>
                        <div className='flex items-center justify-between mb-4'>
                          <div className='flex items-center gap-3'>
                            <div className='p-2 bg-white/20 rounded-lg'>
                              <Award className='w-4 h-4 sm:w-5 sm:h-5' />
                            </div>
                            <span className='text-xs sm:text-sm font-semibold text-emerald-50'>Loyalty Points</span>
                          </div>
                          <Star className='w-5 h-5 sm:w-6 sm:h-6 text-emerald-200' />
                        </div>
                        <p className='text-3xl sm:text-4xl font-bold mb-1'>2,450</p>
                        <p className='text-emerald-100 text-xs sm:text-sm'>Points available to redeem</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className='space-y-4 sm:space-y-6 animate-slideIn'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
                      <h3 className='text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2'>
                        <Package className='w-5 h-5 sm:w-6 sm:h-6 text-emerald-500' />
                        Recent Orders
                      </h3>
                      <button
                        onClick={() => {
                          onClose()
                          navigate('/orders')
                        }}
                        className='text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 hover:gap-2 transition-all duration-300 text-sm sm:text-base'
                      >
                        View All
                        <ChevronRight className='w-4 h-4' />
                      </button>
                    </div>

                    {loading ? (
                      <div className='flex flex-col items-center justify-center py-12'>
                        <div className='relative w-12 h-12 sm:w-16 sm:h-16'>
                          <div className='absolute inset-0 border-4 border-emerald-200 rounded-full animate-pulse'></div>
                          <div className='absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin'></div>
                        </div>
                        <p className='mt-4 text-gray-600 font-medium text-sm sm:text-base'>Loading your orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className='text-center py-12 bg-white rounded-2xl shadow-lg'>
                        <Package className='w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4' />
                        <p className='text-gray-600 text-base sm:text-lg font-medium'>No orders yet</p>
                        <p className='text-gray-400 text-xs sm:text-sm mt-2'>Start shopping to see your orders here!</p>
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        {orders.map((order) => {
                          const statusConfig = getStatusConfig(order.status)
                          return (
                            <div key={order._id} className='bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]'>
                              <div className='flex flex-col sm:flex-row justify-between items-start gap-3 mb-4'>
                                <div>
                                  <p className='text-xs sm:text-sm text-gray-500 mb-1'>Order ID</p>
                                  <p className='font-mono font-bold text-gray-800 text-sm sm:text-base'>#{order._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${statusConfig.color} text-white shadow-lg ring-4 ${statusConfig.ring} text-xs sm:text-sm`}>
                                  <span>{statusConfig.icon}</span>
                                  <span className='font-semibold'>{statusConfig.text}</span>
                                </div>
                              </div>

                              <div className='flex items-center gap-2 mb-4 text-xs sm:text-sm text-gray-600'>
                                <Calendar className='w-3 h-3 sm:w-4 sm:h-4' />
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>

                              <div className='flex items-center mb-4'>
                                <div className='flex -space-x-2 sm:-space-x-3'>
                                  {order.items.slice(0, 4).map((item, index) => (
                                    <div
                                      key={index}
                                      className='w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 sm:ring-4 ring-white shadow-lg overflow-hidden bg-gray-100'
                                      style={{ zIndex: order.items.length - index }}
                                    >
                                      <img
                                        src={item.productId.images?.[0]}
                                        alt='Product'
                                        className='w-full h-full object-cover'
                                      />
                                    </div>
                                  ))}
                                  {order.items.length > 4 && (
                                    <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 sm:ring-4 ring-white bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg text-white font-bold text-xs'>
                                      +{order.items.length - 4}
                                    </div>
                                  )}
                                </div>
                                <div className='ml-3 sm:ml-4'>
                                  <p className='text-xs sm:text-sm text-gray-600'>
                                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>

                              <div className='flex justify-between items-center pt-4 border-t border-gray-200'>
                                <span className='text-gray-600 font-medium text-sm sm:text-base'>Total Amount</span>
                                <span className='text-xl sm:text-2xl font-bold text-emerald-600'>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <div className='space-y-4 sm:space-y-6 animate-slideIn'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
                      <h3 className='text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2'>
                        <MapPin className='w-5 h-5 sm:w-6 sm:h-6 text-emerald-500' />
                        Saved Addresses
                      </h3>
                      <button
                        onClick={() => {
                          onClose()
                          navigate('/address')
                        }}
                        className='bg-emerald-500 text-white px-3 sm:px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base font-semibold'
                      >
                        Add New
                      </button>
                    </div>

                    {loading ? (
                      <div className='flex flex-col items-center justify-center py-12'>
                        <div className='relative w-12 h-12 sm:w-16 sm:h-16'>
                          <div className='absolute inset-0 border-4 border-emerald-200 rounded-full animate-pulse'></div>
                          <div className='absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin'></div>
                        </div>
                        <p className='mt-4 text-gray-600 font-medium text-sm sm:text-base'>Loading addresses...</p>
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className='text-center py-12 bg-white rounded-2xl shadow-lg'>
                        <MapPin className='w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4' />
                        <p className='text-gray-600 text-base sm:text-lg font-medium'>No addresses saved</p>
                        <p className='text-gray-400 text-xs sm:text-sm mt-2'>Add an address for faster checkout</p>
                      </div>
                    ) : (
                      <div className='grid gap-4'>
                        {addresses.map((address) => (
                          <div key={address._id} className='bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]'>
                            <div className='flex items-start justify-between mb-4'>
                              <div className='flex items-center gap-3'>
                                <div className={`p-2 sm:p-3 rounded-xl ${address.type === 'home' ? 'bg-blue-50' : 'bg-purple-50'}`}>
                                  {address.type === 'home' ? (
                                    <Home className='w-4 h-4 sm:w-5 sm:h-5 text-blue-600' />
                                  ) : (
                                    <Briefcase className='w-4 h-4 sm:w-5 sm:h-5 text-purple-600' />
                                  )}
                                </div>
                                <div>
                                  <h4 className='font-bold text-gray-800 text-sm sm:text-lg'>{address.fullAddress}</h4>
                                  <span className={`inline-block mt-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold uppercase ${
                                    address.type === 'home' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                  }`}>
                                    {address.label}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className='space-y-2 text-gray-600 text-sm sm:text-base'>
                              <p className='flex items-center gap-2'>
                                <Phone className='w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0' />
                                <span className='break-words'>{address.phone}</span>
                              </p>
                              <p className='flex items-start gap-2'>
                                <MapPin className='w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 mt-1 flex-shrink-0' />
                                <span className='break-words'>{address.street}, {address.city}, {address.state} - {address.pincode}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Mobile Logout Button */}
                <div className='sm:hidden mt-6'>
                  <button
                    onClick={handleLogout}
                    className='w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 font-semibold'
                  >
                    <LogOut className='w-5 h-5' />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AccountModal