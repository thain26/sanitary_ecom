import { message } from '../../../utils/AntdGlobalContext';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Descriptions, Table, Tag, Button, Steps, Timeline, Space, Select, Input, Modal, Spin, Divider } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, DollarOutlined, CloseCircleOutlined, CarOutlined } from '@ant-design/icons';
import { adminApi } from '../../../services/api';

const { TextArea } = Input;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status update states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  // Payment update states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error(err);
      message.error('Không thể lấy chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatVND = (value) => {
    if (value === undefined || value === null) return '0 â‚«';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) return;
    setStatusLoading(true);
    try {
      await adminApi.updateOrderStatus(order.id, selectedStatus, statusNote);
      message.success('Cập nhật trạng thái đơn hàng thành công');
      setIsStatusModalOpen(false);
      setStatusNote('');
      fetchOrderDetail();
    } catch (err) {
      console.error(err);
      message.error('Cập nhật trạng thái thất bại');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedPaymentStatus) return;
    setPaymentLoading(true);
    try {
      await adminApi.updateOrderPaymentStatus(order.id, selectedPaymentStatus, paymentNote);
      message.success('Cập nhật trạng thái thanh toán thành công');
      setIsPaymentModalOpen(false);
      setPaymentNote('');
      fetchOrderDetail();
    } catch (err) {
      console.error(err);
      message.error('Cập nhật trạng thái thanh toán thất bại');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Đang tải thông tin đơn hàng...">
          <div style={{ padding: 50 }} />
        </Spin>
      </div>
    );
  }

  if (!order) {
    return <Card>Không tìm thấy thông tin đơn hàng.</Card>;
  }

  // Steps mapping
  const statusSteps = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED'];
  const currentStep = statusSteps.indexOf(order.status);

  const getStepStatus = () => {
    if (order.status === 'CANCELLED') return 'error';
    return 'process';
  };

  const itemColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (product) => {
        const primaryImg = product?.images?.find(i => i.isPrimary) || product?.images?.[0];
        return (
          <Space>
            {primaryImg && <img src={primaryImg.url} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }} />}
            <div>
              <strong>{product?.name || 'Sản phẩm đã bị xóa'}</strong>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Model: {product?.modelCode || '-'}</div>
            </div>
          </Space>
        );
      }
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatVND(price)
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'Tổng cộng',
      key: 'subtotal',
      render: (_, record) => <strong style={{ color: '#10b981' }}>{formatVND(record.price * record.quantity)}</strong>
    }
  ];

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/orders')}
          style={{ marginBottom: '8px' }}
        >
          Quay lại danh sách
        </Button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Chi tiết đơn hàng: {order.orderCode}</h1>
            <p className="page-subtitle">Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
          </div>

          <Space>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                setSelectedStatus(order.status);
                setIsStatusModalOpen(true);
              }}
              style={{ backgroundColor: '#0f172a', borderColor: '#0f172a' }}
              disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
            >
              Cập nhật Trạng thái
            </Button>

            <Button
              type="dashed"
              icon={<DollarOutlined />}
              onClick={() => {
                setSelectedPaymentStatus(order.paymentStatus);
                setIsPaymentModalOpen(true);
              }}
              disabled={order.status === 'CANCELLED'}
            >
              Cập nhật Thanh toán
            </Button>
          </Space>
        </div>
      </div>

      {/* Progress Flow */}
      <Card style={{ marginBottom: '24px' }} styles={{ body: { padding: '24px' } }}>
        <Steps
          current={order.status === 'CANCELLED' ? 1 : currentStep}
          status={getStepStatus()}
          items={[
            { title: 'Chờ xác nhận', description: order.status === 'PENDING' ? 'Admin cần duyệt đơn' : '' },
            { title: 'Đã xác nhận', description: order.status === 'CONFIRMED' ? 'Chuẩn bị đóng gói' : '' },
            { title: 'Đang vận chuyển', description: order.status === 'SHIPPING' ? 'Đang trên đường giao' : '' },
            { title: 'Đã giao hàng', description: order.status === 'DELIVERED' ? 'Giao dịch hoàn tất' : '' }
          ]}
        />
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {/* Items Purchased */}
          <Card title="Sản phẩm đã mua" style={{ marginBottom: '24px' }}>
            <Table
              dataSource={order.items}
              columns={itemColumns}
              rowKey="id"
              pagination={false}
            />

            <Divider style={{ margin: '20px 0' }} />

            <div style={{ float: 'right', width: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Tạm tính:</span>
                <span>{formatVND(order.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Phí vận chuyển:</span>
                <span>{formatVND(order.shippingFee)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ef4444' }}>
                  <span>Giảm giá {order.voucherCode ? `(Voucher: ${order.voucherCode})` : '(Voucher)'}:</span>
                  <span>-{formatVND(order.discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <span style={{ color: '#0f172a' }}>Tổng cộng:</span>
                <span style={{ color: '#10b981' }}>{formatVND(order.total)}</span>
              </div>
            </div>
            <div style={{ clear: 'both' }} />
          </Card>

          {/* Delivery & Customer Info */}
          <Card title="Thông tin giao hàng">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Khách hàng">{order.address?.recipientName || order.customerName || '-'}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{order.address?.phone || order.customerPhone || '-'}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ nhận" span={2}>
                {order.address
                  ? [order.address.streetDetail, order.address.ward, order.address.district, order.address.province].filter(Boolean).join(', ')
                  : order.shippingAddress || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                <Tag color="purple">{order.paymentMethod}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Tag color={order.paymentStatus === 'PAID' ? 'success' : 'error'}>
                  {order.paymentStatus === 'PAID' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú người mua" span={2}>
                {order.note || 'Không có ghi chú'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* Status logs timeline */}
          <Card title="Lịch sử cập nhật đơn hàng">
            <Timeline
              items={order.statusHistory?.map((log) => {
                let color = 'blue';
                if (log.status === 'CANCELLED') color = 'red';
                if (log.status === 'DELIVERED') color = 'green';

                return {
                  color: color,
                  children: (
                    <div>
                      <div style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                        {log.status} {log.paymentStatus ? `- ${log.paymentStatus}` : ''}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>
                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                      </div>
                      <div style={{ fontStyle: 'italic', color: '#1e293b' }}>{log.note}</div>
                    </div>
                  )
                };
              })}
              locale={{ emptyText: 'Chưa có lịch sử cập nhật nào' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Status Update Modal */}
      <Modal
        title="Cập nhật Trạng thái Đơn hàng"
        open={isStatusModalOpen}
        onOk={handleUpdateStatus}
        onCancel={() => setIsStatusModalOpen(false)}
        confirmLoading={statusLoading}
        okButtonProps={{ style: { backgroundColor: '#0f172a', borderColor: '#0f172a' } }}
      >
        <div style={{ marginTop: '16px' }}>
          <div style={{ marginBottom: '8px' }}>Chọn trạng thái mới:</div>
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            <Select.Option value="PENDING" disabled={order.status !== 'PENDING'}>Chờ xác nhận (PENDING)</Select.Option>
            <Select.Option value="CONFIRMED" disabled={order.status !== 'PENDING'}>Xác nhận đơn (CONFIRMED)</Select.Option>
            <Select.Option value="SHIPPING" disabled={order.status !== 'CONFIRMED'}>Giao hàng đi (SHIPPING)</Select.Option>
            <Select.Option value="DELIVERED" disabled={order.status !== 'SHIPPING'}>Giao thành công (DELIVERED)</Select.Option>
            <Select.Option value="CANCELLED">Hủy đơn hàng (CANCELLED)</Select.Option>
          </Select>

          <div style={{ marginBottom: '8px' }}>Ghi chú cập nhật:</div>
          <TextArea
            rows={3}
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Ví dụ: Đã giao cho đơn vị vận chuyển Viettel Post..."
          />
        </div>
      </Modal>

      {/* Payment Update Modal */}
      <Modal
        title="Cập nhật Trạng thái Thanh toán"
        open={isPaymentModalOpen}
        onOk={handleUpdatePayment}
        onCancel={() => setIsPaymentModalOpen(false)}
        confirmLoading={paymentLoading}
        okButtonProps={{ style: { backgroundColor: '#0f172a', borderColor: '#0f172a' } }}
      >
        <div style={{ marginTop: '16px' }}>
          <div style={{ marginBottom: '8px' }}>Chọn trạng thái thanh toán mới:</div>
          <Select
            value={selectedPaymentStatus}
            onChange={setSelectedPaymentStatus}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            <Select.Option value="UNPAID">Chưa thanh toán (UNPAID)</Select.Option>
            <Select.Option value="PAID">Đã thanh toán (PAID)</Select.Option>
          </Select>

          <div style={{ marginBottom: '8px' }}>Ghi chú:</div>
          <TextArea
            rows={3}
            value={paymentNote}
            onChange={(e) => setPaymentNote(e.target.value)}
            placeholder="Ví dụ: Đã nhận tiền COD từ bưu tá..."
          />
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetail;
