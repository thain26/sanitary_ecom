import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Alert, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, error, clearError, loading } = useAuthStore();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear state errors on mount
    clearError();
    
    // Check if session expired
    const params = new URLSearchParams(location.search);
    if (params.get('expired')) {
      message.warning('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
    }
  }, [location, clearError]);

  const onFinish = async (values) => {
    try {
      await login(values);
      message.success('Đăng nhập thành công!');
      navigate('/dashboard');
    } catch (err) {
      setShowAlert(true);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      padding: '20px',
    }}>
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)',
        top: '10%',
        left: '10%',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, rgba(0,0,0,0) 70%)',
        bottom: '10%',
        right: '10%',
        zIndex: 0
      }} />

      <Card 
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.3)',
          zIndex: 1
        }}
        bodyStyle={{ padding: '40px 30px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '60px', 
            height: '60px', 
            borderRadius: '14px', 
            backgroundColor: '#0f172a',
            color: '#fff',
            fontSize: '28px',
            marginBottom: '16px',
            boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.3)'
          }}>
            <SafetyCertificateOutlined />
          </div>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            fontFamily: 'Outfit, sans-serif', 
            fontSize: '26px', 
            fontWeight: 700,
            color: '#0f172a' 
          }}>
            Khu Vực Quản Trị
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Hệ thống quản lý Sanitary E-Commerce
          </p>
        </div>

        {showAlert && error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setShowAlert(false)}
            style={{ marginBottom: '24px', borderRadius: '8px' }}
          />
        )}

        <Form
          form={form}
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#94a3b8' }} />} 
              placeholder="Email quản trị viên" 
              style={{ height: '48px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Mật khẩu"
              style={{ height: '48px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ 
                width: '100%', 
                height: '48px', 
                backgroundColor: '#0f172a', 
                borderColor: '#0f172a',
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: '8px'
              }}
            >
              Đăng Nhập Hệ Thống
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
