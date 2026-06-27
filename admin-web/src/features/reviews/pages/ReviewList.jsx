import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, message, Modal, Tooltip, Input } from 'antd';
import { StarFilled, EyeOutlined, EyeInvisibleOutlined, SearchOutlined } from '@ant-design/icons';
import { adminApi } from '../../../services/api';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modelCode, setModelCode] = useState('');

  const fetchReviews = () => {
    setLoading(true);
    adminApi.getReviews(modelCode)
      .then(res => {
        setReviews(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải danh sách đánh giá", err);
        message.error("Lỗi khi tải danh sách đánh giá");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, [modelCode]);

  const handleToggleStatus = (id, currentStatus) => {
    const action = currentStatus ? 'ẩn' : 'hiển thị';
    Modal.confirm({
      title: 'Xác nhận thay đổi trạng thái',
      content: `Bạn có chắc chắn muốn ${action} đánh giá này? Dữ liệu số sao của sản phẩm sẽ được tính toán lại.`,
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk: () => {
        return adminApi.toggleReviewStatus(id)
          .then(() => {
            setReviews(reviews.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
            message.success(`Đã ${action} đánh giá thành công`);
          })
          .catch(err => {
            console.error(`Lỗi ${action} đánh giá`, err);
            message.error(`Không thể ${action} đánh giá này.`);
          });
      }
    });
  };

  const columns = [
    {
      title: 'Sản phẩm (Mã)',
      key: 'product',
      render: (_, record) => record.product?.modelCode || record.product?.sku || record.product?.name,
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Khách hàng',
      key: 'user',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.user?.fullName}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.user?.email}</div>
        </div>
      )
    },
    {
      title: 'Số sao',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating) => (
        <div style={{ color: '#fbbf24' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <StarFilled key={i} style={{ fontSize: '14px', color: i <= rating ? '#fbbf24' : '#e5e7eb' }} />
          ))}
        </div>
      )
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      render: (text, record) => (
        <div>
          <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={text}>
            {text}
          </div>
          {record.imagesJson && record.imagesJson.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              {record.imagesJson.map((img, idx) => (
                <img key={idx} src={img} alt="review" style={{ width: '32px', height: '32px', objectFit: 'cover', border: '1px solid #d9d9d9', borderRadius: '4px' }} />
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Hiển thị' : 'Đã ẩn'}
        </Tag>
      )
    },
    {
      title: 'Ngày đánh giá',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      align: 'right',
      render: (_, record) => (
        <Tooltip title={record.isActive ? "Ẩn đánh giá" : "Hiện đánh giá"}>
          <Button
            type="text"
            icon={record.isActive ? <EyeInvisibleOutlined style={{ color: '#faad14', fontSize: '16px' }} /> : <EyeOutlined style={{ color: '#52c41a', fontSize: '16px' }} />}
            onClick={() => handleToggleStatus(record.id, record.isActive)}
          />
        </Tooltip>
      )
    }
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Quản lý Đánh Giá</h1>
          <p className="page-subtitle">Quản lý phản hồi của khách hàng, ẩn hoặc hiển thị đánh giá</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '24px' }}>
        <div style={{ maxWidth: '400px', marginBottom: '16px' }}>
          <Input
            placeholder="Tìm theo mã sản phẩm..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            allowClear
            size="large"
            onChange={(e) => setModelCode(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={reviews}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên tổng số ${total} đánh giá`
          }}
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
};

export default ReviewList;
