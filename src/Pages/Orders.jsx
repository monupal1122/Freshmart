import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const { user, authToken } = useContext(AuthContext)
  const navigate = useNavigate()
console.log("!!!!",orders);

  useEffect(() => {
    // if (!userId) {
    //   navigate('/login')
    //   return
    // }
    fetchOrders()
  }, [user, navigate])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`https://grocery-backend-3pow.onrender.com/api/order/my`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
console.log("orders###",orders);

      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders || [])
      } else {
        console.error('Failed to fetch orders:', data.message || response.statusText)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
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

  if (!user) {
    return null
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4'>
      <div className='max-w-4xl m-5'>
        <h1 className='text-3xl font-bold mb-8'>My Orders</h1>

        {loading ? (
          <div className='text-center py-16'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto'></div>
            <p className='mt-4 text-gray-600 font-medium'>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className='text-center py-16'>
            <div className='text-6xl mb-4'>📦</div>
            <h3 className='text-2xl font-semibold text-gray-600 mb-2'>No orders yet</h3>
            <p className='text-gray-500 mb-6'>Start shopping to see your orders here</p>
            <button
              onClick={() => navigate('/shop')}
              className='bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 text-lg font-semibold'
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className='space-y-6'>
            {orders.map((order) => (
              <div key={order._id} className='bg-white rounded-lg shadow-md p-6'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-lg font-semibold'>Order #{order._id.slice(-8)}</h3>
                    <p className='text-gray-600 text-sm'>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {/* <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span> */}
                </div>

                <div className='border-t pt-4'>
                  <div className='space-y-3 mb-4'>
                    {order.items.map((item, index) => (
                      <div key={index} className='flex items-center gap-4'>
                        <img
                          src={item.productId.images?.[0] || item.image}
                          alt={item.name}
                          className='w-16 h-16 object-cover rounded border'
                        />
                        <div className='flex-1'>
                          <h4 className='font-medium'>{item.productId.name}</h4>
                          <p className='text-sm text-gray-600'>Quantity: {item.quantity}</p>
                        </div>
                        <p className='font-semibold'>₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  <div className='border-t pt-4 flex justify-between items-center'>
                    <div>
                      <p className='text-sm text-gray-600'>Payment: {order.paymentMethod.toUpperCase()}</p>
                      <p className='text-sm text-gray-600'>
                        Delivery to: {order.addressId.fullAddress}, {order.addressId.city}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm text-gray-600'>Total Amount</p>
                      <p className='text-xl font-bold'>₹{order.totalAmount}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
