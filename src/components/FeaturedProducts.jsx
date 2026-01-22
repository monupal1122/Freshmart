
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Replace this with your actual category ID or make it dynamic
      const categoryId = "69314a4a75e399ddef739a8f";
      
      const response = await fetch(
        `https://grocery-backend-3pow.onrender.com/api/products/category/${categoryId}`
      );
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      console.log("API Response:", json);
      
      // Check if the response has a 'products' property or is an array directly
      const products = Array.isArray(json) ? json : json.products || [];
<<<<<<< HEAD
      // Filter active products
      const activeProducts = products.filter(product => product.status !== false);
      setProducts(activeProducts);
=======
      
      setProducts(products);
>>>>>>> 00a446d2f1bf77bef900972ecbaa0a42b9b56acc
      console.log("Products set:", products.length);
      
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
console.log("fecthed products",products);

  return (
    <section className="py-12 px-3 md:px-0">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6 md:px-8">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/shop">
            <button className="rounded-full cursor-pointer border py-2 px-3 border-gray-500">
              View all Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
