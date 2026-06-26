import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Heart } from 'lucide-react';
import useCartStore from '../../features/cart/store/useCartStore';
import { useAuthStore } from '../../features/auth/store/authStore';
import useWishlistStore from '../../features/wishlist/store/useWishlistStore';
import { publicApi } from '../../services/api';

const Header = () => {
  const [keyword, setKeyword] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const wishlistCount = useWishlistStore(state => state.wishlistIds.length);

  // Search suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const cartCount = useCartStore((state) => {
    const items = state.cart?.items || [];
    return items.reduce((count, item) => count + item.quantity, 0);
  });

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setShowSuggestions(false);
      navigate(`/tim-kiem?q=${encodeURIComponent(keyword)}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion);
    setShowSuggestions(false);
    navigate(`/tim-kiem?q=${encodeURIComponent(suggestion)}`);
  };

  // Suggest debounce logic
  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      publicApi.suggest(keyword)
        .then(res => {
          setSuggestions(res || []);
        })
        .catch(err => console.error("Error fetching suggestions", err));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  // Fetch wishlist is now handled globally in App.jsx

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          AQUA<span style={{ color: 'var(--color-accent)', fontWeight: 400 }}>LUX</span>
        </Link>

        {/* Search Bar Wrapper for Dropdown positioning */}
        <div style={{ position: 'relative', width: '320px' }} onMouseLeave={() => setShowSuggestions(false)}>
          <form onSubmit={handleSearch} className="search-bar" style={{ width: '100%' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm bộ sưu tập..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <Search size={18} style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }} onClick={handleSearch} />
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              borderRadius: '8px',
              marginTop: '4px',
              zIndex: 9999,
              maxHeight: '260px',
              overflowY: 'auto'
            }}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.85rem',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    fontFamily: 'Be Vietnam Pro, sans-serif',
                    borderBottom: index < suggestions.length - 1 ? '1px solid #f5f5f4' : 'none',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#faf9f6'}
                  onMouseLeave={(e) => e.target.style.background = '#fff'}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="header-actions">
          {/* Order Tracking */}
          <Link to="/tra-cuu" className="nav-link" style={{ color: 'var(--color-accent)', marginRight: '1rem' }}>
            Tra cứu đơn
          </Link>

          {/* Wishlist Icon */}
          <Link to="/yeu-thich" className="action-icon" style={{ position: 'relative' }}>
            <Heart size={22} strokeWidth={1.5} />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>

          {/* Cart Icon */}
          <Link to="/gio-hang" className="action-icon" style={{ position: 'relative' }}>
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          {/* User Icon & Dropdown */}
          {isAuthenticated ? (
            <div
              style={{ position: 'relative', display: 'inline-block' }}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-primary)',
                  padding: 0
                }}
                onClick={() => navigate('/tai-khoan')}
              >
                <User size={22} strokeWidth={1.5} />
                <span style={{ fontSize: '0.85rem', marginLeft: '0.25rem', fontFamily: 'Be Vietnam Pro, sans-serif', fontWeight: 500 }}>
                  {user?.fullName?.split(' ').pop()}
                </span>
              </button>

              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: '#fff',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '0.5rem 0',
                  zIndex: 1000,
                  minWidth: '160px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Link
                    to="/tai-khoan"
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem', color: 'var(--color-text)', fontFamily: 'Be Vietnam Pro, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    onClick={() => setShowDropdown(false)}
                  >
                    Hồ sơ của tôi
                  </Link>
                  <Link
                    to="/yeu-thich"
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem', color: 'var(--color-text)', fontFamily: 'Be Vietnam Pro, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    onClick={() => setShowDropdown(false)}
                  >
                    Yêu thích
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                      navigate('/');
                    }}
                    style={{
                      padding: '0.6rem 1.25rem',
                      fontSize: '0.8rem',
                      color: '#ef4444',
                      fontFamily: 'Be Vietnam Pro, sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/dang-nhap" className="action-icon">
              <User size={22} strokeWidth={1.5} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
