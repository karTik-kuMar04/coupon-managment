import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/coupons';
const categoryOptions = ['electronics', 'clothing', 'food', 'books', 'sports'];

export default function FindBestCoupon() {
  const [userTier, setUserTier] = useState('GOLD');
  const [cartTotal, setCartTotal] = useState(1000);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product 1', category: 'electronics', price: 500 }
  ]);

  const [message, setMessage] = useState({ type: '', text: '' });
  const [bestCouponResult, setBestCouponResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const addCartItem = () => {
    setCartItems([...cartItems, { 
      id: Date.now(), 
      name: '', 
      category: 'electronics', 
      price: 0 
    }]);
  };

  const removeCartItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateCartItem = (id, field, value) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateCartTotal = () => {
    const calculatedTotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    return calculatedTotal > 0 ? calculatedTotal : cartTotal;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setBestCouponResult(null);
    setMessage({ type: '', text: '' });

    try {
      const user = { tier: userTier };
      const finalCartTotal = calculateCartTotal();
      const cart = {
        total: finalCartTotal,
        items: cartItems.map(item => ({
          name: item.name || undefined,
          category: item.category,
          price: parseFloat(item.price) || 0
        })).filter(item => item.category)
      };

      const response = await axios.post(`${API_BASE}/best-coupon`, { user, cart });
      setBestCouponResult(response.data);
      
      if (!response.data.bestCoupon) {
        setMessage({ type: 'info', text: 'No applicable coupons found for the given criteria.' });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || error.message || 'Failed to get best coupon'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        
        <h2 className="text-4xl font-bold gradient-text mb-3">Find Best Coupon</h2>
        <p className="text-gray-600 font-medium">Discover the perfect discount for your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card-premium">
              <div className="flex items-center space-x-3 mb-5">
                
                <h3 className="text-xl font-bold text-gray-900">User Information</h3>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  User Tier
                </label>
                <select
                  value={userTier}
                  onChange={(e) => setUserTier(e.target.value)}
                  className="input-field font-semibold"
                >
                  <option value="BRONZE">BRONZE</option>
                  <option value="SILVER">SILVER</option>
                  <option value="GOLD">GOLD</option>
                  <option value="PLATINUM">PLATINUM</option>
                </select>
              </div>
            </div>

            <div className="card-premium">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3">
                  
                  <h3 className="text-xl font-bold text-gray-900">Cart Information</h3>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Cart Total
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={cartTotal}
                    onChange={(e) => setCartTotal(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="input-field font-semibold text-lg"
                    placeholder="Enter cart total"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                </div>
                {cartItems.length > 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    Calculated from items: ${calculateCartTotal().toFixed(2)} (or use manual total above)
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-gray-700">
                    Cart Items
                  </label>
                  <button
                    type="button"
                    onClick={addCartItem}
                    className="btn-secondary text-sm py-1.5 px-3"
                  >
                    Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-600">Item {index + 1}</span>
                        {cartItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCartItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Product Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateCartItem(item.id, 'name', e.target.value)}
                            placeholder="e.g., Laptop"
                            className="input-field text-sm"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Category
                            </label>
                            <select
                              value={item.category}
                              onChange={(e) => updateCartItem(item.id, 'category', e.target.value)}
                              className="input-field text-sm"
                            >
                              {categoryOptions.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Price
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) => updateCartItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className="input-field text-sm"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-3 py-4 text-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Finding Best Coupon...</span>
                </>
              ) : (
                <span>Search Best Coupon</span>
              )}
            </button>
          </form>

          {message.type && (
            <div className={`rounded-xl p-5 border-2 shadow-lg ${
              message.type === 'success' || message.type === 'info'
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-800'
                : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300 text-red-800'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  message.type === 'error' ? 'bg-red-200' : 'bg-blue-200'
                }`}>
                </div>
                <span className="font-bold text-lg">{message.text}</span>
              </div>
            </div>
          )}
        </div>

        <div>
          {bestCouponResult && (
            <div className="card-premium sticky top-8">
              <div className="flex items-center space-x-3 mb-6">
                
                <h3 className="text-2xl font-bold text-gray-900">Best Match</h3>
              </div>
              
              {bestCouponResult.bestCoupon ? (
                <div className="space-y-6">
                  <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-lg font-bold mb-3 shadow-lg">
                            {bestCouponResult.bestCoupon.code}
                          </div>
                          <p className="text-sm text-white/90 font-medium">
                            {bestCouponResult.bestCoupon.description || 'Premium discount offer'}
                          </p>
                        </div>
                        <span className="badge bg-white/20 backdrop-blur-sm text-white border border-white/30 shadow-lg">
                          {bestCouponResult.bestCoupon.type}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                          <p className="text-xs text-white/80 mb-2 font-semibold uppercase tracking-wide">You Save</p>
                          <p className="text-3xl font-bold text-white">
                            ${bestCouponResult.discountAmount.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                          <p className="text-xs text-white/80 mb-2 font-semibold uppercase tracking-wide">Pay Now</p>
                          <p className="text-3xl font-bold text-white">
                            ${bestCouponResult.finalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 space-y-3 border-2 border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <span>Coupon Details</span>
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <span className="text-gray-600 font-semibold">Discount Value:</span>
                        <span className="font-bold text-lg gradient-text">
                          {bestCouponResult.bestCoupon.type === 'FLAT' 
                            ? `$${bestCouponResult.bestCoupon.discountValue}`
                            : `${bestCouponResult.bestCoupon.discountValue}%`
                          }
                        </span>
                      </div>
                      
                      {bestCouponResult.bestCoupon.minCartValue && (
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                          <span className="text-gray-600 font-semibold">Min Cart Value:</span>
                          <span className="font-bold text-gray-900">${bestCouponResult.bestCoupon.minCartValue}</span>
                        </div>
                      )}
                      
                      {bestCouponResult.bestCoupon.userTier && (
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                          <span className="text-gray-600 font-semibold">User Tier:</span>
                          <span className="badge bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md">
                            {bestCouponResult.bestCoupon.userTier}
                          </span>
                        </div>
                      )}
                      
                      {bestCouponResult.bestCoupon.categories?.length > 0 && (
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          <span className="text-gray-600 font-semibold block mb-2">Categories:</span>
                          <div className="flex flex-wrap gap-2">
                            {bestCouponResult.bestCoupon.categories.map(cat => (
                              <span key={cat} className="badge bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 shadow-sm">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {bestCouponResult.applicableCount > 1 && (
                        <div className="pt-3 border-t-2 border-gray-200">
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-600 font-semibold">
                              {bestCouponResult.applicableCount} applicable coupons found
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                      View Raw JSON Response
                    </summary>
                    <pre className="mt-3 bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-xs font-mono border-2 border-gray-700 shadow-lg">
                      {JSON.stringify(bestCouponResult, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-block p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mb-4">
                  </div>
                  <p className="text-gray-700 font-bold text-lg mb-2">No applicable coupons found</p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your user tier or cart total
                  </p>
                </div>
              )}
            </div>
          )}

          {!bestCouponResult && (
            <div className="card-premium">
              <div className="text-center py-16 text-gray-400">
                <div className="inline-block p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mb-6">
                </div>
                <p className="font-bold text-lg text-gray-600 mb-2">Ready to find the best deal?</p>
                <p className="text-sm">Enter user and cart data to discover your perfect coupon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

