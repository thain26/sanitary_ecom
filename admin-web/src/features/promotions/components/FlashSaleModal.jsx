import React from 'react';
import { Modal, Form, Input, Switch, Space } from 'antd';

const FlashSaleModal = ({
  isOpen,
  onClose,
  onSave,
  loading,
  form,
  currentSale
}) => {
  return (
    <Modal
      title={currentSale ? "Chỉnh sửa chiến dịch Flash Sale" : "Tạo chiến dịch Flash Sale mới"}
      open={isOpen}
      onOk={onSave}
      onCancel={onClose}
      confirmLoading={loading}
      okText="Lưu lại"
      cancelText="Hủy bỏ"
      okButtonProps={{ style: { backgroundColor: '#0f172a', borderColor: '#0f172a' } }}
    >
      <Form
        form={form}
        layout="vertical"
        name="flashSaleForm"
        style={{ marginTop: '16px' }}
      >
        <Form.Item
          name="name"
          label="Tên chiến dịch Flash Sale"
          rules={[{ required: true, message: 'Nhập tên chiến dịch!' }]}
        >
          <Input placeholder="Ví dụ: Khuyến mãi bùng nổ giờ vàng 12h..." />
        </Form.Item>

        <Space style={{ display: 'flex', width: '100%' }} size="large">
          <Form.Item
            name="startTime"
            label="Thời gian bắt đầu"
            rules={[{ required: true, message: 'Chọn thời gian bắt đầu!' }]}
            style={{ width: '220px' }}
          >
            <input type="datetime-local" className="ant-input" style={{ width: '100%', height: '32px', borderRadius: '6px', border: '1px solid #d9d9d9', padding: '4px 11px' }} />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="Thời gian kết thúc"
            rules={[{ required: true, message: 'Chọn thời gian kết thúc!' }]}
            style={{ width: '220px' }}
          >
            <input type="datetime-local" className="ant-input" style={{ width: '100%', height: '32px', borderRadius: '6px', border: '1px solid #d9d9d9', padding: '4px 11px' }} />
          </Form.Item>
        </Space>

        <Form.Item name="active" label="Trạng thái" valuePropName="checked" style={{ marginTop: '8px', marginBottom: 0 }}>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FlashSaleModal;
