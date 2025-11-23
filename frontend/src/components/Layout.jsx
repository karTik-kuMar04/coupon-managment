import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="glass-effect sticky top-0 z-50 border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                
                
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Coupon Management</h1>
                <p className="text-xs text-gray-500 font-medium">Premium Deals</p>
              </div>
            </Link>
            
            <nav className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-2xl p-2 shadow-md border border-gray-200/50">
              <Link
                to="/"
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 relative ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-md'
                }`}
              >
                <span className="relative z-10">Create</span>
              </Link>
              <Link
                to="/best-coupon"
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 relative ${
                  isActive('/best-coupon')
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-md'
                }`}
              >
                <span className="relative z-10">Find Best</span>
              </Link>
              <Link
                to="/coupons"
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 relative ${
                  isActive('/coupons')
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-md'
                }`}
              >
                <span className="relative z-10">All Coupons</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="fade-in">
          {children}
        </div>
      </main>
      
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>
      <div className="fixed top-1/4 left-0 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl -z-10"></div>
    </div>
  );
}

