import React from 'react';
import { Modal, Form, Input, Switch } from 'antd';

const { TextArea } = Input;

const BrandModal = ({
  isOpen,
  onClose,
  onSave,
  loading,
  form,
  currentBrand
}) => {
  return (
    <Modal
      title={currentBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
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
        name="brandForm"
        style={{ marginTop: '16px' }}
      >
        <Form.Item
          name="name"
          label="Tên thương hiệu"
          rules={[{ required: true, message: 'Nhập tên thương hiệu!' }]}
        >
          <Input placeholder="Ví dụ: INAX, TOTO, Cotto..." />
        </Form.Item>

        <Form.Item
          name="logoUrl"
          label="Đường dẫn ảnh Logo (URL)"
        >
          <Input placeholder="Ví dụ: https://logo-url.png" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả thương hiệu"
        >
          <TextArea rows={3} placeholder="Nhập mô tả thương hiệu..." />
        </Form.Item>

        <Form.Item
          name="active"
          label="Hoạt động"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BrandModal;
