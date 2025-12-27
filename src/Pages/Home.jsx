import React from 'react'
import Hero from '../components/Hero'
import Category from '../components/Category'
import FeaturedProducts from '../components/FeaturedProducts'
import Template from '../components/Template'
import GroceryAppBanner from '../components/GroceryAppBanner'
import Footer from '../components/Footer'
import WhyChooseUs from '../components/WhyChooseUs'

const Home = () => {
    return (
        <>
            <Hero />
            <Category />
            <FeaturedProducts />
            <Template />
            <GroceryAppBanner/>
            <WhyChooseUs/>
            <Footer/>

        </>
    )
}

export default Home
