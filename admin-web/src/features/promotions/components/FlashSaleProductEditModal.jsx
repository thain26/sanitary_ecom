import React from 'react';
import { Modal, Form, InputNumber } from 'antd';

const FlashSaleProductEditModal = ({
  isOpen,
  onClose,
  onSave,
  loading,
  form,
  editingProduct
}) => {
  return (
    <Modal
      title="Chỉnh sửa sản phẩm Flash Sale"
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
        name="editProductFsForm"
        style={{ marginTop: '16px' }}
      >
        {editingProduct && (
          <div style={{ marginBottom: '16px' }}>
            <strong>Sản phẩm:</strong> {editingProduct.name} ({editingProduct.modelCode})
          </div>
        )}

        <Form.Item
          name="salePrice"
          label="Giá bán Flash Sale (VND)"
          rules={[{ required: true, message: 'Nhập giá bán!' }]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="quantityLimit"
          label="Giới hạn số lượng bán"
          rules={[{ required: true, message: 'Nhập giới hạn số lượng!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="soldCount"
          label="Số lượng đã bán"
          rules={[{ required: true, message: 'Nhập số lượng đã bán!' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FlashSaleProductEditModal;
