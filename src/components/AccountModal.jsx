import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import { toast } from 'react-toastify'


const AccountModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile')
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(false)

  const { user, authToken, logout } = useContext(AuthContext)
  const {clearCart} = useContext(CartContext)
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
        method:'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })

      const data = await response.json()
console.log("data iddar hai ",data);

      if (response.ok) {
        setOrders(data.orders.slice(0, 3)) // Show only last 3 orders
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
 console.log("address yeah hai",data);
 
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 backdrop-blur-[9px] bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col'>
        <div className='flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 border-b gap-2 sm:gap-0'>
          <h2 className='text-2xl font-bold'>My Account</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        <div className='flex flex-col sm:flex-row h-auto sm:h-[600px]'>
          {/* Sidebar */}
          <div className='w-full sm:w-64 bg-gray-50 p-4 sm:p-6 border-b sm:border-b-0 sm:border-r flex-shrink-0'>
            <div className='space-y-2'>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors relative ${
                  activeTab === 'orders'
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                Orders
                {orders.length > 0 && (
                  <span className='absolute right-4 top-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                    {orders.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'addresses'
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                Addresses
              </button>
              <button
                onClick={handleLogout}
                className='w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-red-50 text-red-600'
              >
                Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className='flex-1 p-4 sm:p-6 overflow-y-auto min-h-[200px]'>
            {activeTab === 'profile' && (
              <div>
                <h3 className='text-lg sm:text-xl font-semibold mb-4 sm:mb-6'>Profile Information</h3>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>Name</label>
                    <p className='text-gray-900 bg-gray-50 px-2 sm:px-3 py-2 rounded-md break-words'>{user.username}</p>
                  </div>
                  <div>
                    <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>Email</label>
                    <p className='text-gray-900 bg-gray-50 px-2 sm:px-3 py-2 rounded-md break-words'>{user.email}</p>
                  </div>
                  <div>
                    <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>Member Since</label>
                    <p className='text-gray-900 bg-gray-50 px-2 sm:px-3 py-2 rounded-md'>
                      {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div className='flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2 sm:gap-0'>
                  <h3 className='text-lg sm:text-xl font-semibold'>Recent Orders</h3>
                  <button
                    onClick={() => {
                      onClose()
                      navigate('/orders')
                    }}
                    className='text-green-600 hover:text-green-700 font-medium'
                  >
                    View All Orders
                  </button>
                </div>

                {loading ? (
                  <div className='text-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto'></div>
                    <p className='mt-2 text-gray-600'>Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className='text-center py-8'>
             
                    <p className='text-gray-600'>No orders yet</p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                   {orders.map((order) => (
  <div key={order._id} className='border rounded-lg p-3 sm:p-4'>
    <div className='flex flex-col sm:flex-row justify-between items-start mb-2 sm:mb-3 gap-2 sm:gap-0'>
      <div>
        <p className='font-medium'>Order #{order._id.slice(-8)}</p>
        <p className='text-sm text-gray-600'>
          {new Date(order.createdAt).toLocaleDateString('en-IN')}
        </p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
        {order.status}
      </span>
    </div>
    
    {/* Overlapping Product Images */}
    <div className='flex items-center -space-x-3 mb-2 sm:mb-3'>
      {order.items.slice(0, 4).map((item, index) => (
        <div
          key={index}
          className='relative w-12 h-12 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm'
          style={{ zIndex: order.items.length - index }}
        >
          <img
            src={item.productId.images?.[0]}
            alt={item.product?.name || 'Product'}
            className='w-full h-full object-cover'
          />
        </div>
      ))}
      {order.items.length > 4 && (
        <div className='relative w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center shadow-sm text-xs font-medium text-gray-600'>
          +{order.items.length - 4}
        </div>
      )}
    </div>
    
    <div className='flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-0'>
      <p className='text-xs sm:text-sm text-gray-600'>
        {order.items.length} item{order.items.length > 1 ? 's' : ''}
      </p>
      <p className='font-semibold text-sm sm:text-base'>₹{order.totalAmount}</p>
    </div>
  </div>
))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className='flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2 sm:gap-0'>
                  <h3 className='text-lg sm:text-xl font-semibold'>My Addresses</h3>
                  <button
                    onClick={() => {
                      onClose()
                      navigate('/address')
                    }}
                    className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700'
                  >
                    Add New Address
                  </button>
                </div>

                {loading ? (
                  <div className='text-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto'></div>
                    <p className='mt-2 text-gray-600'>Loading addresses...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className='text-center py-8'>
                    <div className='text-4xl mb-4'></div>
                    <p className='text-gray-600'>No addresses added yet</p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {addresses.map((address) => (
                      <div key={address._id} className='border rounded-lg p-3 sm:p-4'>
                        <div className='flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0'>
                          <div>
                            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-2'>
                              {/* <p className='text-gray-900 bg-white-800 px-3 py-2'>{address.userId}</p> */}
                              {/* <p className='font-medium'>{address.userId}</p><br/> */}
                              <p className='font-medium'>{address.fullAddress}</p>
                              <span className='bg-gray-100 px-2 py-1 rounded text-xs uppercase'>
                                {address.type}
                              </span>
                            </div>
                            <p className='text-gray-600 text-sm mb-1'>{address.phone}</p>
                            <p className='text-gray-600 text-sm'>
                              {address.street}, {address.city}, {address.state} - {address.pincode}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountModal
