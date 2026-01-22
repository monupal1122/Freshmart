
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'

import { toast } from 'react-toastify'

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  const { user, authToken, logout, loading: authLoading } = useContext(AuthContext)
  const { cart, clearCart } = useContext(CartContext)
  const navigate = useNavigate()
console.log("selected address idar hai",selectedAddress);

  useEffect(() => {
    console.log('Payment useEffect - user:', user, 'authToken:', !!authToken, 'authLoading:', authLoading)

    // Wait for auth loading to complete
    if (authLoading) {
      console.log('Auth still loading, waiting...')
      return
    }

    if (!user) {
      console.log('No user found, redirecting to login')
      toast.error('Please login first to proceed with payment')
      setTimeout(() => navigate('/login'), 2000) // Give user time to see the message
      return
    }

    // Get selected address from localStorage
    const address = localStorage.getItem('selectedAddress')
    console.log("pagal iddar hai address",address);
    
    if (address) {
      setSelectedAddress(JSON.parse(address))
      console.log('Selected address loaded:', JSON.parse(address))
    } else {
      console.log('No selected address found, redirecting to address')
      navigate('/address')
      return
    }

    setCartItems(cart)
    console.log('Cart items set:', cart)
  }, [user, cart, navigate, authLoading])

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const deliveryCharge = totalPrice > 500 ? 0 : 25
  const handlingCharge = 5
  const grandTotal = totalPrice + deliveryCharge + handlingCharge

  const handlePayment = async () => {
    if (paymentMethod === 'cod') {
      await processOrder('cod')
    } else {
      await processOnlinePayment()
    }
  }

  const processOrder = async (method, paymentId = null) => {
    setLoading(true)

    try {
      const orderData = {
        userId: user._id || user.id,
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        addressId: selectedAddress._id,
        paymentMethod: method === 'cod' ? 'cash_on_delivery' : 'online',
        totalAmount: grandTotal,
        status: 'pending',
        ...(paymentId && { paymentId })
      }

      const response = await fetch('https://grocery-backend-3pow.onrender.com/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
        navigate('/login');
        return;
      }

      if (response.ok) {
        // Clear cart
        clearCart()
        localStorage.removeItem('selectedAddress')

        toast.success('Order placed successfully!')
        navigate('/orders')
      } else {
        toast.error(data.message || 'Failed to place order')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const processOnlinePayment = async () => {
    setLoading(true)

    try {
      // Create Razorpay order
      const orderResponse = await fetch('https://grocery-backend-3pow.onrender.com/api/payment/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ amount: grandTotal })
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        toast.error('Failed to create payment order')
        setLoading(false)
        return
      }

      // Razorpay options
      const options = {
        key: 'rzp_test_Rdc6BMsOO1d57G', // Your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FreshMart',
        description: 'Order Payment',
        order_id: orderData.id,
        handler: async function (response) {
          // Verify payment
          const verifyResponse = await fetch('https://grocery-backend-3pow.onrender.com/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature
            })
          })

          const verifyData = await verifyResponse.json()

          if (verifyData.status === 'success') {
            // Create order with payment ID
            await processOrder('online', response.razorpay_payment_id)
            toast.success('Payment successful!')
          } else {
            toast.error('Payment verification failed')
            setLoading(false)
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        theme: {
          color: '#22c55e'
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
            toast.info('Payment cancelled')
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
      setLoading(false)
    }
  }

  if (!user || !selectedAddress) {
    return null
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4'>
      <div className='max-w-4xl m-8'>
        <h1 className='text-3xl font-bold text-center mb-8'>Payment</h1>

        <div className='grid lg:grid-cols-2 gap-8'>
          {/* Order Summary */}
          <div className='space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>

              <div className='space-y-3'>
                {cartItems.map((item) => (
                  <div key={item._id} className='flex items-center gap-4'>
                    <img
                      src={item.images?.[0] || item.image}
                      alt={item.name}
                      className='w-16 h-16 object-cover rounded'
                    />
                    <div className='flex-1'>
                      <h3 className='font-medium'>{item.name}</h3>
                      <p className='text-sm text-gray-600'>Qty: {item.quantity}</p>
                    </div>
                    <p className='font-semibold'>₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className='border-t mt-4 pt-4 space-y-2'>
                <div className='flex justify-between'>
                  <span>Items total</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Delivery charge</span>
                  <span className={deliveryCharge === 0 ? 'text-green-600' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Handling charge</span>
                  <span>₹{handlingCharge}</span>
                </div>
                <div className='flex justify-between font-bold text-lg border-t pt-2'>
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Delivery Address</h2>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold'>Delivery Address</span>
                  <span className='bg-gray-100 px-2 py-1 rounded text-xs uppercase'>
                    {(selectedAddress.type || selectedAddress.label || "other").toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className='space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Payment Method</h2>

              <div className='space-y-4'>
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-semibold'>Cash on Delivery</h3>
                      <p className='text-sm text-gray-600'>Pay when you receive your order</p>
                    </div>
                    {paymentMethod === 'cod' && (
                      <div className='text-green-600'>
                        <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'online'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-semibold'>Online Payment</h3>
                      <p className='text-sm text-gray-600'>Pay securely with card/UPI/wallet</p>
                    </div>
                    {paymentMethod === 'online' && (
                      <div className='text-green-600'>
                        <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <button
                onClick={handlePayment}
                disabled={loading}
                className='w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:opacity-50 text-lg font-semibold'
              >
                {loading ? 'Processing...' : `Pay ₹${grandTotal}`}
              </button>
              <p className='text-center text-sm text-gray-600 mt-2'>
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
