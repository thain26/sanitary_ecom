import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, Space, Card, message } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../../services/api';

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState('ALL');
  const [orderCode, setOrderCode] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize, status, orderCode]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getOrders({
        page: currentPage - 1,
        size: pageSize,
        status: status === 'ALL' ? undefined : status,
        orderCode: orderCode || undefined
      });
      setOrders(data.content);
      setTotal(data.totalElements);
    } catch (err) {
      console.error(err);
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setOrderCode(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const formatVND = (value) => {
    if (value === undefined || value === null) return '0 â‚«';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      PENDING: { color: 'warning', label: 'Chờ xác nhận' },
      CONFIRMED: { color: 'blue', label: 'Đã xác nhận' },
      SHIPPING: { color: 'processing', label: 'Đang giao hàng' },
      DELIVERED: { color: 'success', label: 'Đã giao hàng' },
      CANCELLED: { color: 'error', label: 'Đã hủy đơn' }
    };
    const config = statusConfig[status] || { color: 'default', label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const getPaymentStatusTag = (status) => {
    const config = status === 'PAID'
      ? { color: 'success', label: 'Đã thanh toán' }
      : { color: 'error', label: 'Chưa thanh toán' };
    return <Tag color={config.color} bordered={false}>{config.label}</Tag>;
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
      render: (code) => <strong style={{ color: '#4f46e5' }}>{code}</strong>
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleString('vi-VN') : '-'
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => <Tag color="cyan">{method}</Tag>
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => getPaymentStatusTag(status)
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => <strong style={{ color: '#10b981' }}>{formatVND(total)}</strong>
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status)
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          icon={<EyeOutlined />}
          onClick={() => navigate(`/orders/${record.id}`)}
          size="small"
        >
          Chi tiết
        </Button>
      )
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Quản lý đơn hàng</h1>
        <p className="page-subtitle">Xem thông tin giao dịch, cập nhật tiến độ giao hàng và xác nhận thanh toán COD</p>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <Space style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder="Tìm mã đơn hàng..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '250px' }}
            />

            <Select
              value={status}
              onChange={handleStatusChange}
              style={{ width: '180px' }}
            >
              <Select.Option value="ALL">Tất cả trạng thái</Select.Option>
              <Select.Option value="PENDING">Chờ xác nhận</Select.Option>
              <Select.Option value="CONFIRMED">Đã xác nhận</Select.Option>
              <Select.Option value="SHIPPING">Đang giao hàng</Select.Option>
              <Select.Option value="DELIVERED">Đã giao hàng</Select.Option>
              <Select.Option value="CANCELLED">Đã hủy</Select.Option>
            </Select>
          </Space>
        </Space>

        <Table
          dataSource={orders}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
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

export default OrderList;
