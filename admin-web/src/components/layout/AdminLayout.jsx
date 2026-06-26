import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  TagsOutlined,
  OrderedListOutlined,
  UserOutlined,
  GiftOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FireOutlined,
  AppstoreOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../../features/auth/store/authStore';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine active menu item from path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return '1';
    if (path.startsWith('/products')) return '2';
    if (path.startsWith('/categories')) return '3';
    if (path.startsWith('/orders')) return '4';
    if (path.startsWith('/customers')) return '5';
    if (path.startsWith('/vouchers')) return '6';
    if (path.startsWith('/flash-sales')) return '7';
    if (path.startsWith('/collections')) return '8';
    if (path.startsWith('/reviews')) return '9';
    return '1';
  };

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Tổng quan</Link>,
    },
    {
      key: '2',
      icon: <ShoppingOutlined />,
      label: <Link to="/products">Sản phẩm</Link>,
    },
    {
      key: '3',
      icon: <TagsOutlined />,
      label: <Link to="/categories">Danh mục</Link>,
    },
    {
      key: '4',
      icon: <OrderedListOutlined />,
      label: <Link to="/orders">Đơn hàng</Link>,
    },
    {
      key: '5',
      icon: <UserOutlined />,
      label: <Link to="/customers">Khách hàng</Link>,
    },
    {
      key: '6',
      icon: <GiftOutlined />,
      label: <Link to="/vouchers">Khuyến mãi</Link>,
    },
    {
      key: '7',
      icon: <FireOutlined />,
      label: <Link to="/flash-sales">Flash Sale</Link>,
    },
    {
      key: '8',
      icon: <AppstoreOutlined />,
      label: <Link to="/collections">Bộ Sưu Tập</Link>,
    },
    {
      key: '9',
      icon: <StarOutlined />,
      label: <Link to="/reviews">Đánh giá</Link>,
    },
  ];

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        width={240}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: '0 24px',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '18px'
            }}>
              S
            </div>
            {!collapsed && (
              <span style={{ 
                fontFamily: 'Outfit, sans-serif',
                fontSize: '16px', 
                fontWeight: 700, 
                color: '#0f172a',
                whiteSpace: 'nowrap'
              }}>
                SANITARY ADMIN
              </span>
            )}
          </div>
        </div>
        
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{ padding: '16px 0' }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9',
          position: 'sticky',
          top: 0,
          zIndex: 9,
          height: '64px'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />

          <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar style={{ backgroundColor: '#0f172a' }} icon={<UserOutlined />} />
              <span style={{ fontWeight: 500, color: '#1e293b' }}>{user?.fullName || 'Quản trị viên'}</span>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ 
          margin: '24px', 
          padding: '0', 
          minHeight: 280,
          background: 'transparent'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
