import { ChevronRight } from "lucide-react";
import React, { useContext } from "react";
import { CgClose } from "react-icons/cg";
import { GiShoppingBag } from "react-icons/gi";
import { LuNotebookText } from "react-icons/lu";
import { MdDeliveryDining } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CartComp = ({ isOpen, onClose }) => {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login first to proceed with checkout");
      navigate('/login');
      onClose();
      return;
    }
    navigate('/address');
    onClose();
  };

  const increaseQuantity = (id) => {
    setCart(cart.map(item => 
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (id) => {
    setCart(cart.map(item => {
      if (item._id === id) {
        if (item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        } else {
          return null;
        }
      }
      return item;
    }).filter(Boolean));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-[400px] sm:w-[400px] bg-gray-100 shadow-lg z-50 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 flex flex-col`}
      style={{ maxWidth: '100vw' }}
    >
      {/* Header - Fixed */}
      <div className="p-3 sm:p-4 bg-gray-100 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-bold flex justify-between items-center">
          My Cart
          <button onClick={onClose} className="text-red-500 hover:text-red-700 transition">
            <CgClose size={24} />
          </button>
        </h2>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600 font-medium">Your Cart is empty</p>
            <p className="text-sm text-gray-500 mt-2">Add items to get started</p>
          </div>
        ) : (
          <>
            {/* Cart Items - Row Layout */}
            <div className="space-y-3 pb-2">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 p-2 sm:p-3 bg-white rounded-lg shadow-sm"
                >
                  {/* Product Image */}
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border flex-shrink-0"
                  />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium line-clamp-2 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-green-600 font-bold text-base sm:text-lg">
                      ₹{item.price}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-green-600 text-white rounded-md px-2 py-1 gap-2 mt-2 w-fit">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="hover:bg-green-700 px-2 rounded text-lg font-bold"
                      >
                        -
                      </button>
                      <span className="font-medium px-2 text-sm sm:text-base min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item._id)}
                        className="hover:bg-green-700 px-2 rounded text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm sm:text-base text-gray-800">
                      ₹{item.price * item.quantity}
                    </p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm space-y-2">
              <h1 className="text-gray-800 font-bold text-base sm:text-lg mb-2 sm:mb-3">Bill details</h1>
              
              <div className="flex justify-between items-center py-1 text-xs sm:text-sm">
                <h1 className="flex gap-2 items-center text-gray-700">
                  <LuNotebookText className="text-base" />
                  Items total
                </h1>
                <p className="font-medium">₹{totalPrice}</p>
              </div>
              
              <div className="flex justify-between items-center py-1 text-xs sm:text-sm">
                <h1 className="flex gap-2 items-center text-gray-700">
                  <MdDeliveryDining className="text-base" />
                  Delivery charge
                </h1>
                <p className="text-green-600 font-medium">
                  <span className="text-gray-400 line-through mr-1 text-xs">₹25</span> 
                  FREE
                </p>
              </div>
              
              <div className="flex justify-between items-center py-1 text-xs sm:text-sm">
                <h1 className="flex gap-2 items-center text-gray-700">
                  <GiShoppingBag className="text-base" />
                  Handling charge
                </h1>
                <p className="text-green-600 font-medium">₹5</p>
              </div>
              
              <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-gray-200 text-sm sm:text-base">
                <h1 className="font-bold">Grand total</h1>
                <p className="font-bold text-green-600 text-lg">₹{totalPrice + 5}</p>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <h1 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
                Cancellation Policy
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Orders cannot be cancelled once packed for delivery. In case of
                unexpected delays, a refund will be provided, if applicable.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Footer - Fixed (Checkout Button) */}
      {cart.length > 0 && (
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200 shadow-lg flex-shrink-0">
          <button
            onClick={handleCheckout}
            className="bg-green-600 text-white w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-green-700 transition-colors shadow-md"
          >
            <div className="text-left">
              <h1 className="font-bold text-base sm:text-lg">₹{totalPrice + 5}</h1>
              <h1 className="text-gray-100 text-xs">TOTAL</h1>
            </div>
            <div className="flex gap-2 items-center font-semibold">
              <h1 className="text-sm sm:text-base">Proceed to Payment</h1>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default CartComp;
