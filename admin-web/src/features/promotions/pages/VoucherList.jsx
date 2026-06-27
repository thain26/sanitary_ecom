import { message } from '../../../utils/AntdGlobalContext';
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Switch, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { adminApi } from '../../../services/api';

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [form] = Form.useForm();
  const [saveLoading, setSaveLoading] = useState(false);
  const [voucherType, setVoucherType] = useState('PERCENT');

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getVouchers();
      setVouchers(data);
    } catch (err) {
      console.error(err);
      message.error('Không thể lấy danh sách mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setCurrentVoucher(null);
    setVoucherType('PERCENT');
    form.resetFields();

    // Default dates (today to +30 days)
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + 30);

    form.setFieldsValue({
      type: 'PERCENT',
      appliesTo: 'ALL',
      minOrderValue: 0,
      value: 10,
      usageLimit: 100,
      active: true,
      startDate: now.toISOString().slice(0, 16),
      endDate: future.toISOString().slice(0, 16),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (voucher) => {
    setCurrentVoucher(voucher);
    setVoucherType(voucher.type);
    form.resetFields();

    // Format dates to YYYY-MM-DDThh:mm for datetime-local input
    const startStr = voucher.startDate ? new Date(voucher.startDate).toISOString().slice(0, 16) : '';
    const endStr = voucher.endDate ? new Date(voucher.endDate).toISOString().slice(0, 16) : '';

    form.setFieldsValue({
      code: voucher.code,
      name: voucher.name,
      type: voucher.type,
      value: voucher.value,
      minOrderValue: voucher.minOrderValue,
      maxDiscount: voucher.maxDiscount,
      usageLimit: voucher.usageLimit,
      appliesTo: voucher.appliesTo,
      startDate: startStr,
      endDate: endStr,
      active: voucher.active
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaveLoading(true);

      // Convert ISO strings from HTML datetime-local inputs into ZonedDateTime ISO format
      const payload = {
        ...values,
        startDate: values.startDate ? new Date(values.startDate).toISOString() : null,
        endDate: values.endDate ? new Date(values.endDate).toISOString() : null,
      };

      if (currentVoucher) {
        await adminApi.updateVoucher(currentVoucher.id, payload);
        message.success('Cập nhật mã giảm giá thành công');
      } else {
        await adminApi.createVoucher(payload);
        message.success('Thêm mã giảm giá thành công');
      }
      setIsModalOpen(false);
      fetchVouchers();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu mã giảm giá');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteVoucher(id);
      message.success('Vô hiệu hóa mã giảm giá thành công');
      fetchVouchers();
    } catch (err) {
      console.error(err);
      message.error('Không thể xóa mã giảm giá');
    }
  };

  const getCampaignStatus = (record) => {
    const now = new Date();
    const start = new Date(record.startDate);
    const end = new Date(record.endDate);

    if (!record.active) {
      return <Tag color="default">Đang tạm dừng</Tag>;
    }
    if (now < start) {
      return <Tag color="blue">Sắp diễn ra</Tag>;
    }
    if (now > end) {
      return <Tag color="red">Đã kết thúc</Tag>;
    }
    return <Tag color="green">Đang hoạt động</Tag>;
  };

  const handleToggleActive = async (voucher) => {
    try {
      const payload = {
        code: voucher.code,
        name: voucher.name,
        type: voucher.type,
        value: voucher.value,
        minOrderValue: voucher.minOrderValue,
        maxDiscount: voucher.maxDiscount,
        usageLimit: voucher.usageLimit,
        appliesTo: voucher.appliesTo,
        startDate: voucher.startDate,
        endDate: voucher.endDate,
        active: !voucher.active
      };
      await adminApi.updateVoucher(voucher.id, payload);
      message.success(`Đã ${!voucher.active ? 'Bật' : 'Tắt'} mã giảm giá thành công`);
      fetchVouchers();
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const formatVND = (value) => {
    if (value === undefined || value === null) return '0 â‚«';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const columns = [
    {
      title: 'Mã code',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <strong style={{ color: '#4f46e5' }}>{text}</strong>
    },
    {
      title: 'Tên chiến dịch',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại giảm',
      dataIndex: 'type',
      key: 'type',
      render: (type) => type === 'PERCENT' ? <Tag color="blue">Phần trăm (%)</Tag> : <Tag color="green">Số tiền cố định</Tag>
    },
    {
      title: 'Giá trị giảm',
      key: 'value',
      render: (_, record) => record.type === 'PERCENT' ? `${record.value}%` : formatVND(record.value)
    },
    {
      title: 'Đơn tối thiểu',
      dataIndex: 'minOrderValue',
      key: 'minOrderValue',
      render: (val) => formatVND(val)
    },
    {
      title: 'Giới hạn dùng',
      key: 'usage',
      render: (_, record) => (
        <span>{record.usedCount} / {record.usageLimit || 'âˆ'}</span>
      )
    },
    {
      title: 'Thời hạn',
      key: 'validity',
      render: (_, record) => {
        const start = new Date(record.startDate).toLocaleDateString('vi-VN');
        const end = new Date(record.endDate).toLocaleDateString('vi-VN');
        return <span style={{ fontSize: '12px' }}>{start} - {end}</span>;
      }
    },
    {
      title: 'Trạng thái hoạt động',
      key: 'status',
      width: 250,
      render: (_, record) => (
        <Space size="middle">
          <Switch
            checked={record.active}
            size="small"
            onChange={() => handleToggleActive(record)}
            checkedChildren="Bật"
            unCheckedChildren="Tắt"
          />
          {getCampaignStatus(record)}
        </Space>
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#4f46e5' }} />}
            onClick={() => handleOpenEdit(record)}
          />
          <Popconfirm
            title="Ngừng kích hoạt voucher này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Quản lý khuyến mãi & Vouchers</h1>
          <p className="page-subtitle">Thiết lập mã giảm giá, cấu hình điều kiện áp dụng cho đơn hàng</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreate}
          style={{ backgroundColor: '#0f172a', borderColor: '#0f172a', height: '40px', borderRadius: '8px' }}
        >
          Tạo Voucher mới
        </Button>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <Table
          dataSource={vouchers}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </div>

      <Modal
        title={currentVoucher ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={saveLoading}
        okText="Lưu lại"
        cancelText="Hủy bỏ"
        okButtonProps={{ style: { backgroundColor: '#0f172a', borderColor: '#0f172a' } }}
      >
        <Form
          form={form}
          layout="vertical"
          name="voucherForm"
          style={{ marginTop: '16px' }}
        >
          <Form.Item
            name="code"
            label="Mã Code"
            rules={[
              { required: true, message: 'Nhập mã code!' },
              { pattern: /^[A-Z0-9_-]+$/, message: 'Mã code viết hoa không dấu và không khoảng trắng!' }
            ]}
          >
            <Input placeholder="Ví dụ: INAX2026, CHAOHE" style={{ textTransform: 'uppercase' }} />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên chiến dịch"
            rules={[{ required: true, message: 'Nhập tên chiến dịch!' }]}
          >
            <Input placeholder="Ví dụ: Khuyến mãi hè bùng nổ..." />
          </Form.Item>

          <Space style={{ display: 'flex', width: '100%' }} size="large">
            <Form.Item
              name="type"
              label="Loại giảm giá"
              rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
              style={{ width: '200px' }}
            >
              <Select onChange={setVoucherType}>
                <Select.Option value="PERCENT">Giảm theo % (PERCENT)</Select.Option>
                <Select.Option value="FIXED_AMOUNT">Giảm số tiền cố định (FIXED_AMOUNT)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="value"
              label="Giá trị giảm"
              rules={[{ required: true, message: 'Nhập giá trị giảm!' }]}
              style={{ width: '230px' }}
            >
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                formatter={value => voucherType === 'PERCENT' ? `${value}` : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', width: '100%' }} size="large">
            <Form.Item
              name="minOrderValue"
              label="Đơn hàng tối thiểu (VND)"
              rules={[{ required: true, message: 'Vui lòng nhập đơn tối thiểu!' }]}
              style={{ width: '200px' }}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="maxDiscount"
              label="Giảm tối đa (chỉ cho %)"
              extra="Nếu giảm số tiền cố định, bỏ trống."
              style={{ width: '230px' }}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', width: '100%' }} size="large">
            <Form.Item
              name="usageLimit"
              label="Giới hạn số lần sử dụng"
              rules={[{ required: true, message: 'Nhập giới hạn!' }]}
              style={{ width: '200px' }}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="appliesTo"
              label="Ăp dụng cho"
              rules={[{ required: true, message: 'Vui lòng chọn đối tượng áp dụng!' }]}
              style={{ width: '230px' }}
            >
              <Select>
                <Select.Option value="ALL">Tất cả đơn hàng</Select.Option>
              </Select>
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', width: '100%' }} size="large">
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
              style={{ width: '200px' }}
            >
              <input type="datetime-local" className="ant-input" style={{ width: '100%', height: '32px', borderRadius: '6px', border: '1px solid #d9d9d9', padding: '4px 11px' }} />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
              style={{ width: '230px' }}
            >
              <input type="datetime-local" className="ant-input" style={{ width: '100%', height: '32px', borderRadius: '6px', border: '1px solid #d9d9d9', padding: '4px 11px' }} />
            </Form.Item>
          </Space>

          <Form.Item name="active" label="Trạng thái" valuePropName="checked" style={{ marginTop: '8px', marginBottom: 0 }}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherList;
