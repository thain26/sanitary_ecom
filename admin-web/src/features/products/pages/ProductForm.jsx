import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Switch, Button, Row, Col, Space, Divider, message, Card } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { adminApi } from '../../../services/api';

const { TextArea } = Input;

const ProductForm = ({ visible, initialValues, onSave, onCancel, confirmLoading }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchLookups();
      if (initialValues) {
        // Prepare initial values for Form
        const formattedValues = {
          ...initialValues,
          categoryId: initialValues.category?.id,
          brandId: initialValues.brand?.id,
          isActive: initialValues.active,
          isFeatured: initialValues.featured,
          images: initialValues.images?.map(img => ({
            url: img.url,
            alt: img.alt || '',
            isPrimary: img.primary || img.isPrimary || false,
            sortOrder: img.sortOrder || 0
          })) || []
        };
        form.setFieldsValue(formattedValues);
      } else {
        form.resetFields();
        form.setFieldsValue({
          basePrice: 0,
          salePrice: 0,
          stock: 0,
          isActive: true,
          isFeatured: false,
          detail: '',
          images: []
        });
      }
    }
  }, [visible, initialValues, form]);

  const fetchLookups = async () => {
    setLoadingLookups(true);
    try {
      const [catsData, brandsData] = await Promise.all([
        adminApi.getCategories(),
        adminApi.getBrands()
      ]);
      // Only keep active ones for select dropdown
      setCategories(catsData.filter(c => c.active));
      setBrands(brandsData.filter(b => b.active));
    } catch (err) {
      console.error(err);
      message.error('Không thể lấy danh sách danh mục hoặc thương hiệu');
    } finally {
      setLoadingLookups(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();



      // Map back to API format
      const payload = {
        name: values.name,
        modelCode: values.modelCode,
        description: values.description,
        detail: values.detail,
        basePrice: values.basePrice,
        salePrice: values.salePrice,
        stock: values.stock,
        featured: values.isFeatured,
        active: values.isActive,
        categoryId: values.categoryId || null,
        brandId: values.brandId || null,
        images: values.images?.map((img, index) => {
          const primaryVal = img.isPrimary !== undefined ? img.isPrimary : index === 0;
          return {
            url: img.url,
            isPrimary: primaryVal
          };
        }) || []
      };

      onSave(payload);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="productForm"
    >
      <Row gutter={16}>
        <Col span={16}>
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input placeholder="Ví dụ: Bàn cầu một khối INAX AC-902VN" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="modelCode"
                label="Mã Model"
                rules={[{ required: true, message: 'Vui lòng nhập mã model!' }]}
              >
                <Input placeholder="Ví dụ: AC-902VN" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="Danh mục"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select
                  placeholder="Chọn danh mục"
                  loading={loadingLookups}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {categories.map(cat => (
                    <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="brandId"
                label="Thương hiệu"
                rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
              >
                <Select
                  placeholder="Chọn thương hiệu"
                  loading={loadingLookups}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {brands.map(brand => (
                    <Select.Option key={brand.id} value={brand.id}>{brand.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả sản phẩm"
          >
            <TextArea rows={4} placeholder="Nhập mô tả chi tiết về sản phẩm, tính năng, đặc điểm nổi bật..." />
          </Form.Item>

          <Form.Item
            name="detail"
            label="Chi tiết sản phẩm"
          >
            <TextArea rows={6} placeholder="Nhập chi tiết về thông số, chất liệu, xuất xứ..." />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Card title="Giá & Kho hàng" size="small" style={{ marginBottom: '16px' }}>
            <Form.Item
              name="basePrice"
              label="Giá niêm yết (VND)"
              rules={[{ required: true, message: 'Vui lòng nhập giá gốc!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="salePrice"
              label="Giá khuyến mãi (VND)"
              extra="Nếu không giảm giá, đặt bằng giá niêm yết."
              rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="stock"
              label="Số lượng tồn kho"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Card>

          <Card title="Trạng thái hiển thị" size="small" style={{ marginBottom: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
                <span>Đang kinh doanh:</span>
                <Form.Item name="isActive" valuePropName="checked" noStyle>
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" style={{ marginLeft: 'auto' }} />
                </Form.Item>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
                <span>Sản phẩm nổi bật:</span>
                <Form.Item name="isFeatured" valuePropName="checked" noStyle>
                  <Switch checkedChildren="Có" unCheckedChildren="Không" style={{ marginLeft: 'auto' }} />
                </Form.Item>
              </div>
            </Space>
          </Card>

          <Card title="Hình ảnh sản phẩm" size="small">
            <Form.List name="images">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} style={{ marginBottom: '12px', padding: '8px', border: '1px dashed #cbd5e1', borderRadius: '6px', position: 'relative' }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'url']}
                        rules={[{ required: true, message: 'Nhập link ảnh!' }]}
                        style={{ marginBottom: '4px' }}
                      >
                        <Input placeholder="Đường dẫn ảnh (URL)" />
                      </Form.Item>

                      <Row gutter={8} style={{ marginTop: '4px' }}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'isPrimary']}
                            valuePropName="checked"
                            style={{ marginBottom: 0 }}
                          >
                            <Switch checkedChildren="Ảnh chính" unCheckedChildren="Ảnh phụ" size="small" />
                          </Form.Item>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => remove(name)}
                          >
                            Xóa
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Thêm ảnh
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Col>
      </Row>

      <Divider />

      <div style={{ textAlign: 'right' }}>
        <Space>
          <Button onClick={onCancel}>Hủy bỏ</Button>
          <Button type="primary" onClick={handleSubmit} loading={confirmLoading} style={{ backgroundColor: '#0f172a', borderColor: '#0f172a' }}>
            Lưu thay thế
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default ProductForm;
