import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Space, Modal, message, Badge } from 'antd';
import { SearchOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { adminApi } from '../../../services/api';

const CustomerList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, keyword]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers({
        page: currentPage - 1,
        size: pageSize,
        keyword: keyword || undefined
      });
      setUsers(data.content);
      setTotal(data.totalElements);
    } catch (err) {
      console.error(err);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setKeyword(value);
    setCurrentPage(1);
  };

  const handleToggleStatus = (user) => {
    const isLocked = user.status === 'LOCKED';
    const actionText = isLocked ? 'mở khóa' : 'khóa';
    const newStatus = isLocked ? 'ACTIVE' : 'LOCKED';

    Modal.confirm({
      title: `Xác nhận ${actionText} tài khoản?`,
      content: `Tài khoản ${user.email} sẽ bị ${isLocked ? 'mở khóa hoạt động' : 'ngăn chặn đăng nhập và mua sắm'} trên hệ thống.`,
      okText: 'Xác nhận',
      cancelText: 'Hủy bán',
      okButtonProps: { danger: !isLocked, style: isLocked ? { backgroundColor: '#0f172a', borderColor: '#0f172a' } : undefined },
      onOk: async () => {
        try {
          await adminApi.updateUserStatus(user.id, newStatus);
          message.success(`Đã ${actionText} tài khoản thành công!`);
          fetchUsers();
        } catch (err) {
          console.error(err);
          message.error('Cập nhật trạng thái người dùng thất bại');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <div>
          <strong style={{ color: '#0f172a' }}>{text}</strong>
          {record.role === 'ADMIN' && <Tag color="red" style={{ marginLeft: 8 }}>Admin</Tag>}
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <span>{email}</span>
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa cập nhật</span>
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => {
        if (status === 'ACTIVE') {
          return <Badge status="success" text="Hoạt động" />;
        } else if (status === 'LOCKED') {
          return <Badge status="error" text="Đã bị khóa" />;
        }
        return <Badge status="default" text={status} />;
      }
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      render: (_, record) => {
        // Prevent admin from locking themselves or other admins (can modify as needed)
        if (record.role === 'ADMIN') return null;

        const isLocked = record.status === 'LOCKED';
        return (
          <Button
            type="primary"
            ghost={!isLocked}
            danger={!isLocked}
            icon={isLocked ? <UnlockOutlined /> : <LockOutlined />}
            size="small"
            onClick={() => handleToggleStatus(record)}
            style={isLocked ? { color: '#10b981', borderColor: '#10b981', backgroundColor: 'transparent' } : undefined}
          >
            {isLocked ? 'Mở khóa' : 'Khóa tài khoản'}
          </Button>
        );
      }
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Quản lý khách hàng</h1>
        <p className="page-subtitle">Xem thông tin người dùng đăng ký tài khoản, phân quyền và kiểm soát quyền truy cập hệ thống</p>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ maxWidth: '400px', marginBottom: '16px' }}>
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            allowClear
            size="large"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên tổng số ${total} kết quả`,
            showSizeChanger: true,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }
          }}
        />
      </div>
    </div>
  );
};

export default CustomerList;
