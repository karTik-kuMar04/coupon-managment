import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/coupons';

const categoryOptions = ['electronics', 'clothing', 'food', 'books', 'sports'];

export default function CreateCoupon() {
  const [couponForm, setCouponForm] = useState({
    code: '',
    type: 'FLAT',
    discountValue: '',
    maxDiscountAmount: '',
    minCartValue: '',
    expiryDate: '',
    userTier: '',
    categories: [],
    maxUsage: '',
    description: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'categories') {
      const newCategories = checked
        ? [...couponForm.categories, value]
        : couponForm.categories.filter(cat => cat !== value);
      setCouponForm({ ...couponForm, categories: newCategories });
    } else {
      setCouponForm({ ...couponForm, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        code: couponForm.code,
        type: couponForm.type,
        discountValue: parseFloat(couponForm.discountValue),
        categories: couponForm.categories || []
      };

      if (couponForm.maxDiscountAmount) {
        payload.maxDiscountAmount = parseFloat(couponForm.maxDiscountAmount);
      }
      if (couponForm.minCartValue) {
        payload.minCartValue = parseFloat(couponForm.minCartValue);
      }
      if (couponForm.maxUsage) {
        payload.maxUsage = parseInt(couponForm.maxUsage);
      }
      if (couponForm.expiryDate) {
        payload.expiryDate = couponForm.expiryDate;
      }
      if (couponForm.userTier) {
        payload.userTier = couponForm.userTier;
      }
      if (couponForm.description) {
        payload.description = couponForm.description;
      }

      await axios.post(API_BASE, payload);
      setMessage({ type: 'success', text: `Coupon "${couponForm.code}" created successfully!` });
      
      setCouponForm({
        code: '',
        type: 'FLAT',
        discountValue: '',
        maxDiscountAmount: '',
        minCartValue: '',
        expiryDate: '',
        userTier: '',
        categories: [],
        maxUsage: '',
        description: ''
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || error.message || 'Failed to create coupon'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
       
        <h2 className="text-4xl font-bold gradient-text mb-3">Create New Coupon</h2>
        <p className="text-gray-600 font-medium">Design your premium discount offer</p>
      </div>

      <div className="card-premium">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
              <span>Coupon Code</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={couponForm.code}
              onChange={handleChange}
              required
              placeholder="e.g., SAVE20"
              className="input-field text-lg font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 items-center space-x-2">
                <span>Discount Type</span>
                <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={couponForm.type}
                onChange={handleChange}
                required
                className="input-field font-semibold"
              >
                <option value="FLAT">FLAT Amount</option>
                <option value="PERCENT">PERCENTAGE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
                <span>Discount Value</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="discountValue"
                  value={couponForm.discountValue}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder={couponForm.type === 'FLAT' ? 'e.g., 50' : 'e.g., 20 (for 20%)'}
                  className="input-field font-semibold text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  {couponForm.type === 'FLAT' ? '$' : '%'}
                </span>
              </div>
            </div>
          </div>

          {couponForm.type === 'PERCENT' && (
            <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
                <span>Max Discount Amount</span>
                <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="maxDiscountAmount"
                  value={couponForm.maxDiscountAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g., 100"
                  className="input-field font-semibold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
                <span>Minimum Cart Value</span>
                <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="minCartValue"
                  value={couponForm.minCartValue}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g., 500"
                  className="input-field font-semibold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
                <span>Expiry Date</span>
                <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                value={couponForm.expiryDate}
                onChange={handleChange}
                className="input-field font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
                <span>User Tier</span>
                <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </label>
              <select
                name="userTier"
                value={couponForm.userTier}
                onChange={handleChange}
                className="input-field font-semibold"
              >
                <option value="">Any Tier</option>
                <option value="BRONZE">BRONZE</option>
                <option value="SILVER">SILVER</option>
                <option value="GOLD">GOLD</option>
                <option value="PLATINUM">PLATINUM</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
                <span>Max Usage</span>
                <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                name="maxUsage"
                value={couponForm.maxUsage}
                onChange={handleChange}
                min="1"
                placeholder="e.g., 100"
                className="input-field font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
              <span>Categories</span>
              <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {categoryOptions.map(cat => (
                <label
                  key={cat}
                  className={`inline-flex items-center px-5 py-3 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    couponForm.categories.includes(cat)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-600 text-white shadow-lg'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="categories"
                    value={cat}
                    checked={couponForm.categories.includes(cat)}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-bold capitalize">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
              <span>Description</span>
              <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <textarea
              name="description"
              value={couponForm.description}
              onChange={handleChange}
              placeholder="Add a compelling description for your coupon..."
              rows="4"
              className="input-field resize-none font-medium"
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
            <div className="text-sm text-gray-500 font-medium">
              <span className="text-red-500">*</span> Required fields
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-3 px-8 py-4 text-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Premium Coupon...</span>
                </>
              ) : (
                <span>Create Premium Coupon</span>
              )}
            </button>
          </div>

          {message.type && (
            <div className={`rounded-xl p-5 border-2 shadow-lg ${
              message.type === 'success'
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800'
                : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300 text-red-800'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  message.type === 'success' ? 'bg-green-200' : 'bg-red-200'
                }`}>
                </div>
                <span className="font-bold text-lg">{message.text}</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

