import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Address from "./Pages/Address";
import Payment from "./Pages/Payment";
import Orders from "./Pages/Orders";
import Contact from "./Pages/Contact";
import ProductDetailsPage from "./Pages/ProductDetailsPage";

const Layout = () => {
  const location = useLocation();

  // hide navbar and footer on shop page
  const hideNavbar = location.pathname === "/shop";
  const hideFooter = location.pathname === "/shop";
  return (
    <>
      {!hideNavbar && <Navbar />}

      <div className={`${!hideNavbar ? 'pt-1' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/address" element={<Address />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/product/:id" element={<ProductDetailsPage/>}/>
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>

      {/* {!hideFooter && <Footer />} */}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;
