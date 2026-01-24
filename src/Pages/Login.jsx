import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
// Import your logo image
import logoImage from '../assets/logo1.png'; // Adjust the path and filename

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 flex items-center justify-center px-4 py-12 relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-teal-200/30 to-transparent rounded-full blur-3xl"></div>
      
      <div className='max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center relative z-10'>
        {/* Left Side - Branding */}
        <div className='hidden md:flex flex-col justify-center space-y-8 p-8'>
          {/* Logo */}
          <div className='flex items-center gap-3 mb-4'>
            {/* Logo Image - Option 1: Square/Icon logo */}
            <div className='bg-white p-2 rounded-2xl shadow-lg'>
              <img 
                src={logoImage} 
                alt="FreshMart Logo" 
                className='w-14 h-14 object-contain'
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className='hidden bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl'>
                <ShoppingBag className='w-10 h-10 text-white' />
              </div>
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>FreshMart</h1>
              <p className='text-sm text-gray-600'>Fresh Groceries Delivered</p>
            </div>
          </div>

          {/* Illustration with Image */}
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl transform rotate-3'></div>
            <div className='relative bg-white rounded-3xl p-8 shadow-2xl'>
              {/* Replace emoji with image */}
              <div className='flex items-center justify-center mb-6'>
                <img 
                  src={logoImage} 
                  alt="Shopping Illustration" 
                  className='w-32 h-32 object-contain'
                  onError={(e) => {
                    // Fallback to emoji if image fails
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="text-8xl"></div>';
                  }}
                />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-3 text-center'>
                Welcome Back!
              </h3>
              <p className='text-gray-600 text-center leading-relaxed'>
                Login to access fresh groceries, exclusive deals, and fast delivery right to your doorstep
              </p>
            </div>
          </div>

          {/* Features */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='bg-emerald-100 p-2 rounded-lg'>
                <Sparkles className='w-5 h-5 text-emerald-600' />
              </div>
              <div>
                <h4 className='font-semibold text-gray-900'>Fresh Products Daily</h4>
                <p className='text-sm text-gray-600'>100% fresh and organic items</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='bg-teal-100 p-2 rounded-lg'>
                <Sparkles className='w-5 h-5 text-teal-600' />
              </div>
              <div>
                <h4 className='font-semibold text-gray-900'>Fast Delivery</h4>
                <p className='text-sm text-gray-600'>Get your order in 2 hours</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='bg-green-100 p-2 rounded-lg'>
                <Sparkles className='w-5 h-5 text-green-600' />
              </div>
              <div>
                <h4 className='font-semibold text-gray-900'>Best Prices</h4>
                <p className='text-sm text-gray-600'>Exclusive deals and discounts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className='bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100'>
          {/* Mobile Logo with Image */}
          <div className='md:hidden flex items-center justify-center gap-3 mb-8'>
            <div className='bg-white p-2 rounded-2xl shadow-lg border border-gray-100'>
              <img 
                src={logoImage} 
                alt="FreshMart Logo" 
                className='w-12 h-12 object-contain'
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className='hidden bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl'>
                <ShoppingBag className='w-8 h-8 text-white' />
              </div>
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>FreshMart</h1>
              <p className='text-xs text-gray-600'>Fresh Groceries Delivered</p>
            </div>
          </div>

          {/* Rest of the form code stays the same... */}
          <div className='mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>Welcome Back!</h2>
            <p className='text-gray-600'>Please login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email Input */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                  <Mail className='w-5 h-5' />
                </div>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
                  placeholder='Enter your email'
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                  <Lock className='w-5 h-5' />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className='w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
                  placeholder='Enter your password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition'
                >
                  {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  className='w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500'
                />
                <span className='text-sm text-gray-600'>Remember me</span>
              </label>
              <Link to='/forgot-password' className='text-sm text-emerald-600 hover:text-emerald-700 font-medium'>
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group'
            >
              {loading ? (
                <div className='flex items-center gap-2'>
                  <div className='w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin'></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className='relative my-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-4 bg-white text-gray-500'>Or continue with</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className='text-center'>
            <p className='text-gray-600'>
              Don't have an account?{' '}
              <Link to='/signup' className='text-emerald-600 hover:text-emerald-700 font-bold'>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;