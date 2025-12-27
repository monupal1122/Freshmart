import React from 'react'
import HeroImg from "../assets/Hero1.png"
import { Link } from 'react-router-dom'

const Hero = () => {
    return (
        <section className='relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white mt-1 md:mt-0 overflow-hidden'>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full"></div>
                <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white rounded-full"></div>
            </div>

            <div className='relative max-w-6xl mx-auto py-20 flex flex-col md:flex-row items-center px-6 md:px-0 gap-7'>
                <div className='md:w-1/2 mb-8 md:mb-0 animate-fadeInUp'>
                    <h1 className='text-5xl md:text-6xl font-bold mb-6 leading-tight'>
                        Fresh <span className='text-yellow-300 drop-shadow-lg'>Groceries</span><br />
                        <span className='text-3xl md:text-4xl font-light'>Delivered to Your Door</span>
                    </h1>
                    <p className='text-xl mb-8 text-green-100 leading-relaxed'>
                        Shop from our wide selection of fresh fruits, vegetables, dairy, and more.
                        Get same-day delivery with our premium quality guarantee!
                    </p>

                    {/* Stats */}
                    <div className='flex flex-wrap gap-6 mb-8'>
                        <div className='text-center'>
                            <div className='text-2xl font-bold text-yellow-300'>10K+</div>
                            <div className='text-sm text-green-100'>Happy Customers</div>
                        </div>
                        <div className='text-center'>
                            <div className='text-2xl font-bold text-yellow-300'>500+</div>
                            <div className='text-sm text-green-100'>Fresh Products</div>
                        </div>
                        <div className='text-center'>
                            <div className='text-2xl font-bold text-yellow-300'>24/7</div>
                            <div className='text-sm text-green-100'>Support</div>
                        </div>
                    </div>

                    <div className='flex flex-wrap gap-4 items-center'>
                        <Link to={'/shop'}>
                            <button className='cursor-pointer bg-white text-green-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300 rounded-full px-8 py-4 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2'>
                                <span></span> Shop Now
                            </button>
                        </Link>
                        <Link to={'/about'}>
                            <button className='text-white cursor-pointer border-2 border-white bg-transparent hover:bg-white hover:text-green-600 transition-all duration-300 rounded-full px-8 py-4 font-semibold flex items-center gap-2'>
                                <span></span> Learn More
                            </button>
                        </Link>
                    </div>
                </div>

                <div className='md:w-1/2 relative flex justify-center animate-fadeInRight'>
                    {/* Floating elements */}
                    <div className="absolute -top-4 -left-4 bg-yellow-300 text-green-800 px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                        🌟 Fresh
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce" style={{animationDelay: '1s'}}>
                        ⚡ Fast Delivery
                    </div>

                    <div className='relative'>
                        <div className='absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm transform rotate-3 hover:rotate-0 transition-transform duration-500'></div>
                        <div className='absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-orange-300/20 rounded-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500'></div>
                        <img
                            src={HeroImg}
                            alt="Fresh Groceries"
                            className='relative z-10 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-500 hover:scale-105'
                        />
                    </div>
                </div>
            </div>

            {/* Wave separator */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" className="w-full h-12 fill-white">
                    <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                </svg>
            </div>
        </section>
    )
}

export default Hero
