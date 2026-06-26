import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '120px',
        fontWeight: 800,
        color: '#0f172a',
        margin: 0,
        lineHeight: 1
      }}>404</h1>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 600,
        color: '#334155',
        marginTop: '16px',
        marginBottom: '8px'
      }}>Không tìm thấy trang</h2>
      <p style={{
        fontSize: '16px',
        color: '#64748b',
        maxWidth: '500px',
        marginBottom: '32px'
      }}>
        Trang bạn đang tìm kiếm có thể đã bị xóa, thay đổi tên hoặc tạm thời không khả dụng.
      </p>
      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '8px',
        fontWeight: 600,
        textDecoration: 'none',
        transition: 'background-color 0.2s'
      }}>
        Trở về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
