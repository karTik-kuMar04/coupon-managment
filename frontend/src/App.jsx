import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CreateCoupon from './pages/CreateCoupon';
import FindBestCoupon from './pages/FindBestCoupon';
import AllCoupons from './pages/AllCoupons';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<CreateCoupon />} />
          <Route path="/best-coupon" element={<FindBestCoupon />} />
          <Route path="/coupons" element={<AllCoupons />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
