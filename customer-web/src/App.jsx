import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './features/home/Home';
import ProductList from './features/products/pages/ProductList';
import ProductDetail from './features/products/pages/ProductDetail';
import Cart from './features/cart/pages/Cart';
import Checkout from './features/checkout/pages/Checkout';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import Profile from './features/profile/pages/Profile';
import OrderTracking from './features/orders/pages/OrderTracking';
import OrderSuccess from './features/orders/pages/OrderSuccess';
import Wishlist from './features/wishlist/pages/Wishlist';
import CollectionDetail from './features/products/pages/CollectionDetail';
import useCartStore from './features/cart/store/useCartStore';
import useWishlistStore from './features/wishlist/store/useWishlistStore';
import ChatWidget from './components/layout/ChatWidget';
import LoginPromptModal from './features/auth/components/LoginPromptModal';
import NotFound from './pages/NotFound';
import Toast from './components/common/Toast';

import ScrollToTop from './components/common/ScrollToTop';

function App() {
  const fetchCart = useCartStore(state => state.fetchCart);
  const fetchWishlist = useWishlistStore(state => state.fetchWishlist);

  useEffect(() => {
    fetchCart();
    fetchWishlist();
  }, [fetchCart, fetchWishlist]);

  return (
    <Router>
      <ScrollToTop />
      <Header />
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/danh-muc/:slug" element={<ProductList />} />
          <Route path="/tim-kiem" element={<ProductList />} />
          <Route path="/san-pham/:slug" element={<ProductDetail />} />
          <Route path="/gio-hang" element={<Cart />} />
          <Route path="/thanh-toan" element={<Checkout />} />
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/dang-ky" element={<Register />} />
          <Route path="/quen-mat-khau" element={<ForgotPassword />} />
          <Route path="/tai-khoan" element={<Profile />} />
          <Route path="/tra-cuu" element={<OrderTracking />} />
          <Route path="/dat-hang-thanh-cong" element={<OrderSuccess />} />
          <Route path="/yeu-thich" element={<Wishlist />} />
          <Route path="/bo-suu-tap/:slug" element={<CollectionDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
      <LoginPromptModal />
      <Toast />
    </Router>
  );
}

export default App;
