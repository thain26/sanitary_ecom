import { message } from '../../../utils/AntdGlobalContext';
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Switch, Tag, Button, Card, Typography, Input, Modal, Form, Space, Image, Drawer, List, Avatar, Popconfirm, Select, Divider, Badge, Tooltip, Empty } from 'antd';
import {
  PictureOutlined, EditOutlined, AppstoreOutlined,
  PlusOutlined, DeleteOutlined, SearchOutlined, UnorderedListOutlined
} from '@ant-design/icons';
import api from '../../../services/api';

const { Title, Text } = Typography;

const CollectionList = () => {
  const [collections, setCollections] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create / Edit modal
  const [editModal, setEditModal] = useState(null); // null = closed, {} = creating, {id,...} = editing
  const [editLoading, setEditLoading] = useState(false);
  const [form] = Form.useForm();

  // Manage products drawer
  const [productDrawer, setProductDrawer] = useState(null); // null | collection object
  const [productSearch, setProductSearch] = useState('');
  const [addingProduct, setAddingProduct] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Fetch all collections with their products
  const fetchCollections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/collections');
      setCollections(res.data);
    } catch {
      message.error('Không thể tải danh sách bộ sưu tập.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all products for the picker
  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get('/admin/products?page=0&size=5000');
      setAllProducts(res.data.content || res.data || []);
    } catch {
      // fallback to public API
      try {
        const res = await api.get('/public/products?size=5000');
        setAllProducts(res.data.content || []);
      } catch {
        setAllProducts([]);
      }
    }
  }, []);

  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, [fetchCollections, fetchProducts]);

  // â”€â”€â”€ Toggle banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleToggleBanner = async (id) => {
    try {
      const res = await api.put(`/admin/collections/${id}/toggle-banner`);
      setCollections(prev => prev.map(c => c.id === id ? res.data : c));
      message.success('Đã cập nhật trạng thái banner.');
    } catch {
      message.error('Không thể cập nhật trạng thái banner.');
    }
  };

  // â”€â”€â”€ Open Create modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleOpenCreate = () => {
    setEditModal({});
    form.resetFields();
  };

  // â”€â”€â”€ Open Edit modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleOpenEdit = (record) => {
    setEditModal(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description || '',
      bannerUrl: record.bannerUrl || '',
    });
  };

  // â”€â”€â”€ Save (create or update) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setEditLoading(true);
      if (editModal?.id) {
        // Update
        const res = await api.put(`/admin/collections/${editModal.id}`, values);
        setCollections(prev => prev.map(c => c.id === editModal.id ? { ...c, ...res.data } : c));
        message.success('Cập nhật bộ sưu tập thành công!');
      } else {
        // Create
        const res = await api.post('/admin/collections', values);
        setCollections(prev => [...prev, { ...res.data, products: [] }]);
        message.success('Tạo bộ sưu tập mới thành công!');
      }
      setEditModal(null);
    } catch (err) {
      if (err?.errorFields) return; // validation error
      message.error('Không thể lưu bộ sưu tập.');
    } finally {
      setEditLoading(false);
    }
  };

  // â”€â”€â”€ Delete collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/collections/${id}`);
      setCollections(prev => prev.filter(c => c.id !== id));
      message.success('Đã xoá bộ sưu tập.');
    } catch {
      message.error('Không thể xoá bộ sưu tập.');
    }
  };

  // â”€â”€â”€ Open Manage Products drawer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleOpenProducts = (record) => {
    setProductDrawer(record);
    setProductSearch('');
    setSelectedProductId(null);
  };

  // â”€â”€â”€ Add product to collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleAddProduct = async () => {
    if (!selectedProductId || !productDrawer) return;
    setAddingProduct(true);
    try {
      const res = await api.post(`/admin/collections/${productDrawer.id}/products/${selectedProductId}`);
      const updatedCollection = res.data;
      setProductDrawer(updatedCollection);
      setCollections(prev => prev.map(c => c.id === updatedCollection.id ? updatedCollection : c));
      setSelectedProductId(null);
      message.success('Đã thêm sản phẩm vào bộ sưu tập.');
    } catch {
      message.error('Không thể thêm sản phẩm.');
    } finally {
      setAddingProduct(false);
    }
  };

  // â”€â”€â”€ Remove product from collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleRemoveProduct = async (productId) => {
    if (!productDrawer) return;
    try {
      const res = await api.delete(`/admin/collections/${productDrawer.id}/products/${productId}`);
      const updatedCollection = res.data;
      setProductDrawer(updatedCollection);
      setCollections(prev => prev.map(c => c.id === updatedCollection.id ? updatedCollection : c));
      message.success('Đã xoá sản phẩm khỏi bộ sưu tập.');
    } catch {
      message.error('Không thể xoá sản phẩm.');
    }
  };

  // â”€â”€â”€ Product options not already in collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const currentProductIds = new Set((productDrawer?.products || []).map(p => p.id));
  const productOptions = allProducts
    .filter(p => !currentProductIds.has(p.id))
    .map(p => ({ value: p.id, label: `${p.name} (${p.modelCode || ''})` }));

  // â”€â”€â”€ Table columns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const columns = [
    {
      title: 'Ảnh Banner',
      dataIndex: 'bannerUrl',
      key: 'bannerUrl',
      width: 120,
      render: (url) =>
        url ? (
          <Image src={url} alt="Banner" width={90} height={60}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg=="
          />
        ) : (
          <div style={{
            width: 90, height: 60, background: '#f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 4, color: '#94a3b8'
          }}>
            <PictureOutlined style={{ fontSize: 20 }} />
          </div>
        )
    },
    {
      title: 'Tên bộ sưu tập',
      key: 'name',
      render: (_, record) => (
        <div>
          <Text strong style={{ color: '#1e293b' }}>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>/{record.slug}</Text>
        </div>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc) => desc || <Text type="secondary" italic>Chưa có mô tả</Text>
    },
    {
      title: 'Sản phẩm',
      key: 'productCount',
      width: 130,
      align: 'center',
      render: (_, record) => (
        <Badge count={record.products?.length || 0} showZero
          style={{ backgroundColor: (record.products?.length || 0) > 0 ? '#3b82f6' : '#94a3b8' }}>
          <Button type="text" icon={<UnorderedListOutlined />}
            onClick={() => handleOpenProducts(record)}
            style={{ color: '#3b82f6' }} size="small">
            Quản lý
          </Button>
        </Badge>
      )
    },
    {
      title: 'Hero Banner',
      dataIndex: 'showOnHeroBanner',
      key: 'showOnHeroBanner',
      width: 140,
      align: 'center',
      render: (val, record) => (
        <Switch checked={val} onChange={() => handleToggleBanner(record.id)}
          checkedChildren="Bật" unCheckedChildren="Tắt" />
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button icon={<EditOutlined />} size="small"
              onClick={() => handleOpenEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Xoá bộ sưu tập này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá" cancelText="Huỷ" okType="danger"
          >
            <Tooltip title="Xoá">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Bộ Sưu Tập
          </Title>
          <Text type="secondary" style={{ marginTop: 4, display: 'block', fontSize: 14 }}>
            Quản lý bộ sưu tập sản phẩm và chọn collection hiển thị trên Hero Banner trang chủ.
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}
          style={{ background: '#0f172a' }}>
          Tạo bộ sưu tập mới
        </Button>
      </div>

      {/* Table */}
      <Card style={{ borderRadius: 8 }}
      >
        <Table dataSource={collections} columns={columns} rowKey="id"
          loading={loading} pagination={false}
          locale={{ emptyText: 'Chưa có bộ sưu tập nào. Hãy tạo mới!' }} />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        title={editModal?.id ? 'Chỉnh sửa bộ sưu tập' : 'Tạo bộ sưu tập mới'}
        open={editModal !== null}
        onOk={handleSave}
        onCancel={() => setEditModal(null)}
        confirmLoading={editLoading}
        okText={editModal?.id ? 'Lưu thay đổi' : 'Tạo mới'}
        cancelText="Huỷ"
        width={580}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Tên bộ sưu tập" name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên bộ sưu tập' }]}>
            <Input placeholder="VD: Bộ Sưu Tập Satis 2025" />
          </Form.Item>
          <Form.Item label="Mô tả ngắn" name="description">
            <Input.TextArea rows={3}
              placeholder="Mô tả vọbộ sưu tập, sẽ hiển thị trên Hero Banner..." />
          </Form.Item>
          <Form.Item label="URL Ảnh Banner" name="bannerUrl"
            extra="Đường dẫn ảnh banner (khuyến nghị tỷ lệ 16:5 hoặc 1920Ă—600px)">
            <Input placeholder="https://example.com/banner.jpg" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Manage Products Drawer */}
      <Drawer
        title={
          <div>
            <Text strong style={{ fontSize: 16 }}>Quản lý sản phẩm</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>{productDrawer?.name}</Text>
          </div>
        }
        open={!!productDrawer}
        onClose={() => setProductDrawer(null)}
        width={560}
        extra={
          <Tag color="blue">{productDrawer?.products?.length || 0} sản phẩm</Tag>
        }
      >
        {/* Add product section */}
        <div style={{ marginBottom: 20, padding: '16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>
            <PlusOutlined /> Thêm sản phẩm vào bộ sưu tập
          </Text>
          <div style={{ display: 'flex', gap: 8 }}>
            <Select
              showSearch
              placeholder="Tìm và chọn sản phẩm..."
              style={{ flex: 1 }}
              value={selectedProductId}
              onChange={(val) => setSelectedProductId(val)}
              options={productOptions}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              notFoundContent={<Empty description="Không tìm thấy sản phẩm" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
              allowClear
            />
            <Button type="primary" onClick={handleAddProduct}
              loading={addingProduct} disabled={!selectedProductId}
              style={{ background: '#0f172a' }}>
              Thêm
            </Button>
          </div>
        </div>

        <Divider style={{ margin: '0 0 16px' }} />

        {/* Current products list */}
        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>Sản phẩm hiện có</Text>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Lọc sản phẩm..."
            value={productSearch}
            onChange={e => setProductSearch(e.target.value)}
            style={{ width: 200 }}
            size="small"
            allowClear
          />
        </div>

        {(!productDrawer?.products || productDrawer.products.length === 0) ? (
          <Empty description="Chưa có sản phẩm nào trong bộ sưu tập này"
            image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 40 }} />
        ) : (
          <List
            dataSource={(productDrawer?.products || []).filter(p =>
              !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
              (p.modelCode || '').toLowerCase().includes(productSearch.toLowerCase())
            )}
            renderItem={(product) => (
              <List.Item
                key={product.id}
                style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}
                actions={[
                  <Popconfirm
                    key="remove"
                    title="Xoá sản phẩm khỏi bộ sưu tập?"
                    onConfirm={() => handleRemoveProduct(product.id)}
                    okText="Xoá" cancelText="Huỷ" okType="danger"
                  >
                    <Button icon={<DeleteOutlined />} size="small" danger type="text" />
                  </Popconfirm>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={product.images?.[0]?.url}
                      shape="square"
                      size={48}
                      icon={<PictureOutlined />}
                      style={{ background: '#f1f5f9' }}
                    />
                  }
                  title={<Text style={{ fontSize: 13 }}>{product.name}</Text>}
                  description={
                    <Space size={4}>
                      <Tag color="default" style={{ fontSize: 11 }}>{product.modelCode}</Tag>
                      {product.brand && <Tag color="blue" style={{ fontSize: 11 }}>{product.brand.name}</Tag>}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </div>
  );
};

export default CollectionList;
