import React from 'react';
import { Card, Form, Select, InputNumber, Button } from 'antd';

const ProductSelectorForm = ({
  form,
  onAdd,
  onSearch,
  searchLoading,
  searchResults,
  addLoading
}) => {
  return (
    <Card title="Thêm sản phẩm vào Flash Sale" size="small">
      <Form
        form={form}
        layout="inline"
        onFinish={onAdd}
        style={{ alignItems: 'flex-end', gap: '10px' }}
      >
        <Form.Item
          name="productId"
          label="Chọn sản phẩm"
          rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
          style={{ width: '280px', margin: 0 }}
        >
          <Select
            showSearch
            placeholder="Tìm tên hoặc model..."
            filterOption={false}
            onSearch={onSearch}
            loading={searchLoading}
            notFoundContent={searchLoading ? 'Đang tìm...' : 'Không thấy sản phẩm'}
            style={{ width: '100%' }}
          >
            {searchResults.map(p => (
              <Select.Option key={p.id} value={p.id}>
                {p.name} ({p.modelCode})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="salePrice"
          label="Giá bán"
          rules={[{ required: true, message: 'Nhập giá bán' }]}
          style={{ width: '150px', margin: 0 }}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="VND"
          />
        </Form.Item>

        <Form.Item
          name="quantityLimit"
          label="G.Hạn"
          rules={[{ required: true, message: 'Nhập giới hạn' }]}
          style={{ width: '100px', margin: 0 }}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Số lượng" />
        </Form.Item>

        <Form.Item style={{ margin: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={addLoading}
            style={{ backgroundColor: '#0f172a', borderColor: '#0f172a' }}
          >
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductSelectorForm;
