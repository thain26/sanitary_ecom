import React from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';

const { TextArea } = Input;

const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  loading,
  form,
  currentCategory,
  parentOptions
}) => {
  return (
    <Modal
      title={currentCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
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
        name="categoryForm"
        style={{ marginTop: '16px' }}
      >
        <Form.Item
          name="name"
          label="Tên danh mục"
          rules={[{ required: true, message: 'Nhập tên danh mục!' }]}
        >
          <Input placeholder="Ví dụ: Bồn cầu, Sen vòi..." />
        </Form.Item>

        <Form.Item
          name="parentId"
          label="Danh mục cha (Cấp trên)"
        >
          <Select
            placeholder="Chọn danh mục cấp trên (nếu có)"
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {parentOptions.map(cat => (
              <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Đường dẫn ảnh minh họa (URL)"
        >
          <Input placeholder="Đường dẫn ảnh hiển thị danh mục" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả danh mục"
        >
          <TextArea rows={3} placeholder="Nhập mô tả ngắn..." />
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

export default CategoryModal;
