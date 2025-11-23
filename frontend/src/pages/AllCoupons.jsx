import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/coupons';

export default function AllCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE);
      setCoupons(response.data.coupons || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    return type === 'FLAT' 
      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
      : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md';
  };

  const getTierColor = (tier) => {
    const colors = {
      BRONZE: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md',
      SILVER: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md',
      GOLD: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md',
      PLATINUM: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
    };
    return colors[tier] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="card-premium text-center py-16">
          <div className="relative inline-block">
            <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Loading amazing deals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="card-premium bg-gradient-to-br from-red-50 to-pink-50 border-red-200 text-red-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            </div>
            <p className="font-semibold text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold gradient-text mb-2">All Coupons</h2>
          <p className="text-gray-600 font-medium flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>{coupons.length} premium coupon{coupons.length !== 1 ? 's' : ''} available</span>
          </p>
        </div>
        <button onClick={fetchCoupons} className="btn-secondary flex items-center space-x-2 group">
          <span>Refresh</span>
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="card-premium text-center py-16">
          <div className="inline-block p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mb-6">
          </div>
          <p className="text-gray-700 font-bold text-xl mb-2">No coupons found</p>
          <p className="text-gray-500">Create your first premium coupon to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon, index) => (
            <div 
              key={coupon.id || coupon._id} 
              className="card-premium hover:scale-105 transition-all duration-300 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg">
                        {coupon.code}
                      </div>
                      <span className={`badge ${getTypeColor(coupon.type)} shadow-md`}>
                        {coupon.type}
                      </span>
                    </div>
                    {coupon.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 font-medium">{coupon.description}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-gray-600">Discount</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold gradient-text">
                      {coupon.type === 'FLAT' 
                        ? `$${coupon.discountValue}`
                        : `${coupon.discountValue}%`
                      }
                    </span>
                    {coupon.type === 'PERCENT' && coupon.maxDiscountAmount && (
                      <p className="text-xs text-gray-500 mt-1">Max ${coupon.maxDiscountAmount}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {coupon.minCartValue && (
                  <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Min Cart Value</span>
                    <span className="font-bold text-gray-900">${coupon.minCartValue}</span>
                  </div>
                )}

                {coupon.userTier && (
                  <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">User Tier</span>
                    <span className={`badge ${getTierColor(coupon.userTier)} shadow-sm`}>
                      {coupon.userTier}
                    </span>
                  </div>
                )}

                {coupon.expiryDate && (
                  <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Expires</span>
                    <span className="font-bold text-gray-900">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {coupon.categories?.length > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {coupon.categories.map(cat => (
                        <span key={cat} className="badge bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs shadow-sm">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {coupon.maxUsage && (
                  <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-200">
                    <span className="text-gray-600 font-medium">Usage Limit</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${((coupon.usedCount || 0) / coupon.maxUsage) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-900 text-xs">
                        {coupon.usedCount || 0} / {coupon.maxUsage}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <span>{new Date(coupon.createdAt).toLocaleDateString()}</span>
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

