import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { User, MapPin, ClipboardList, Heart, LogOut } from 'lucide-react';

import ProfileInfoTab from '../components/ProfileInfoTab';
import AddressBookTab from '../components/AddressBookTab';
import OrderHistoryTab from '../components/OrderHistoryTab';
import WishlistTab from '../../wishlist/components/WishlistTab';

const Profile = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const [activeTab, setActiveTab] = useState('profile');

  // Ensure user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/dang-nhap');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0', minHeight: 'calc(100vh - 200px)' }}>
      <div className="container">
        <h1 style={{ fontSize: '2rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          Tài Khoản Của Tôi
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem' }}>
          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ padding: '1.5rem', border: '1px solid var(--color-border)', marginBottom: '1.5rem', textAlign: 'center', background: '#fff' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem', color: 'var(--color-accent)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={40} />}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--color-primary)' }}>{user?.fullName}</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>{user?.email}</p>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', border: 'none',
                background: activeTab === 'profile' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'profile' ? '#fff' : 'var(--color-text)',
                textAlign: 'left', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
              <User size={18} /> Thông tin cá nhân
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', border: 'none',
                background: activeTab === 'addresses' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'addresses' ? '#fff' : 'var(--color-text)',
                textAlign: 'left', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
              <MapPin size={18} /> Sổ địa chỉ
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', border: 'none',
                background: activeTab === 'orders' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'orders' ? '#fff' : 'var(--color-text)',
                textAlign: 'left', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
              <ClipboardList size={18} /> Lịch sử đơn hàng
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', border: 'none',
                background: activeTab === 'wishlist' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'wishlist' ? '#fff' : 'var(--color-text)',
                textAlign: 'left', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
              <Heart size={18} /> Danh sách yêu thích
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', border: 'none', background: 'transparent', color: '#ef4444', textAlign: 'left', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', marginTop: '1.5rem', transition: 'all 0.3s'
              }}
            >
              <LogOut size={18} /> Đăng xuất
            </button>
          </div>

          {/* Details Content Area */}
          <div style={{ background: '#fff', border: '1px solid var(--color-border)', padding: '2.5rem' }}>
            {activeTab === 'profile' && <ProfileInfoTab />}
            {activeTab === 'addresses' && <AddressBookTab />}
            {activeTab === 'orders' && <OrderHistoryTab />}
            {activeTab === 'wishlist' && <WishlistTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
