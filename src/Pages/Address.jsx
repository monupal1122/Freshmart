import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AuthContext} from "../context/AuthContext";
import { CartContext } from "../context/CartContext";


const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: "home",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });
console.log("all address",addresses);

  const { user, authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && (user._id || user.id)) {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(
        `https://grocery-backend-3pow.onrender.com/api/address`,
        {method:'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();
console.log("data hai ",data);

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        await logout();
        navigate('/login');
        return;
      }

      if (response.ok) {
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };
// const fetchAddresses = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`https://grocery-backend-3pow.onrender.com/api/address`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${authToken}`,
//         },
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setAddresses(data.addresses || []);
//       } else {
//         Alert.alert('Failed to Load Addresses', data.message || 'Please try again');
//       }
//     } catch (err) {
//       console.error('Fetch addresses error:', err);
//       SweetAlert.showAlertWithOptions({
//         title: 'Network Error',
//         subTitle: 'Please check your connection',
//         style: 'error',
//         confirmButtonTitle: 'OK',
//         confirmButtonColor: '#EF4444'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || (!user._id && !user.id)) {
      toast.error("Please login first to add an address");
      setTimeout(() => navigate('/login'), 2000); // Give user time to see the message
      return;
    }

    try {
      const url = editingAddress
        ? `https://grocery-backend-3pow.onrender.com/api/address/${editingAddress._id}`
        : "https://grocery-backend-3pow.onrender.com/api/address";

      const method = editingAddress ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...formData,
          userId: user._id,
        }),
      });
console.log("response",response);

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        await logout();
        navigate('/login');
        return;
      }

      if (response.ok) {
        const savedAddress = await response.json()
        console.log("saved address by you",savedAddress);

        toast.success(editingAddress ? "Address updated!" : "Address saved!");
        setShowForm(false);
        setEditingAddress(null);
        setFormData({
          label: "Home",
          fullAddress: "",
          city: "",
          state: "",
          pincode: "",
          isDefault: false,
        });
        await fetchAddresses(); // Wait for addresses to be refreshed
        // Auto-select the new address and navigate to payment only for new addresses
        if (!editingAddress) {
          // Ensure the address has userId for proper association
          const addressWithUserId = { ...savedAddress, userId: user._id || user.id };
          localStorage.setItem('selectedAddress', JSON.stringify(addressWithUserId));
          console.log('Navigating to payment with user:', user);
          console.log('Auth token present:', !!authToken);
          console.log('Address stored:', addressWithUserId);
          // Navigate immediately without delay
          navigate('/payment');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to save address");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };
  console.log("address hai iidar hai ",addresses);
  

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      fullAddress: address.fullAddress,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: false,
    });
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      const response = await fetch(
        `https://grocery-backend-3pow.onrender.com/api/address/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Address deleted!");
        fetchAddresses();
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  const selectAddress = (address ) => {

    console.log("address kya",address);
    
    // Store selected address in localStorage for payment page
    localStorage.setItem("selectedAddress", JSON.stringify(address));
    navigate("/payment");
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Delivery Addresses</h1>
            <p className="text-gray-600">Select or add a delivery address for your order</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingAddress(null);
              setFormData({
                type: "home",
                fullAddress: "",
                city: "",
                state: "",
                pincode: "",
                isDefault: false,
              });
            }}

            className="bg-gradient-to-r from-green-800 to-emerald-800 text-white px-2 py-1 rounded-xl hover:from-green-600 hover:to-emerald-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"

          >
            {showForm ? "Cancel" : "+ Add New Address"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-transparent hover:border-green-200 transition-all duration-300 animate-fadeInUp">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Full Name
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div> */}
              {/*
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Phone Number
                </label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {editingAddress ? "Update Address" : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading addresses...
            </p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No addresses found
            </h3>
            <p className="text-gray-500 mb-6">
              Add your delivery address to continue shopping
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 text-lg font-semibold"
            >
              Add Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address, index) => (
              <div
                key={address._id}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl p-6 border-2 border-transparent hover:border-green-300 transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => selectAddress(address)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-2 rounded-xl text-sm font-bold ${
                      address.type === "home"
                        ? "bg-blue-100 text-blue-800"
                        : address.type === "work"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {address.type === "home" ? "🏠" : address.type === "work" ? "💼" : ""}
                      {(address.type || "other").toUpperCase()}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(address);
                      }}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                      title="Edit Address"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(address._id);
                      }}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                      title="Delete Address"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-semibold text-base leading-relaxed">{address.fullAddress}</p>
                      <p className="text-gray-600 text-sm mt-1">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => selectAddress(address)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Deliver Here
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;
