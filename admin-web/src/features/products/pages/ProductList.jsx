import { message } from '../../../utils/AntdGlobalContext';
import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Tag, Modal, Drawer, Switch, Badge, Select } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { adminApi } from '../../../services/api';
import ProductForm from './ProductForm';
import PageHeader from '../../../components/common/PageHeader';
import DataTableCard from '../../../components/common/DataTableCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Drawer state for Create / Edit
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize, keyword, selectedCategory, selectedBrand, selectedStatus]);

  const fetchCategories = async () => {
    try {
      const [catData, brandData] = await Promise.all([
        adminApi.getCategories(),
        adminApi.getBrands()
      ]);
      setCategories(catData);
      setBrands(brandData);
    } catch (err) {
      console.error('Failed to load filters data', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProducts({
        page: currentPage - 1, // backend is 0-indexed
        size: pageSize,
        keyword: keyword || undefined,
        categoryId: selectedCategory || undefined,
        brandId: selectedBrand || undefined,
        active: selectedStatus !== null && selectedStatus !== undefined ? selectedStatus : undefined
      });
      setProducts(data.content);
      setTotal(data.totalElements);
    } catch (err) {
      console.error(err);
      message.error('Không thể lấy danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setKeyword(value);
    setCurrentPage(1); // reset to page 1
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa sản phẩm?',
      content: 'Sản phẩm này sẽ bị xóa vĩnh viễn khỏi hệ thống. Thao tác này không thể hoàn tác.',
      okText: 'Xóa vĩnh viễn',
      okType: 'danger',
      cancelText: 'Hủy bỏ',
      onOk: async () => {
        try {
          await adminApi.deleteProduct(id);
          message.success('Đã xóa sản phẩm thành công');
          fetchProducts();
        } catch (err) {
          console.error(err);
          message.error('Lỗi khi xóa sản phẩm. Có thể sản phẩm này đã phát sinh giao dịch (đơn hàng).');
        }
      }
    });
  };

  const handleOpenCreate = () => {
    setCurrentProduct(null);
    setDrawerVisible(true);
  };

  const handleOpenEdit = (product) => {
    setCurrentProduct(product);
    setDrawerVisible(true);
  };

  const handleSave = async (payload) => {
    setSaveLoading(true);
    try {
      if (currentProduct) {
        // Update product
        await adminApi.updateProduct(currentProduct.id, payload);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        // Create product
        await adminApi.createProduct(payload);
        message.success('Thêm sản phẩm thành công');
      }
      setDrawerVisible(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleToggleFeatured = async (product) => {
    const originalFeatured = product.featured;
    // Optimistic Update
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, featured: !originalFeatured } : p));
    try {
      const updatedPayload = {
        name: product.name,
        modelCode: product.modelCode,
        sku: product.sku,
        detail: product.detail,
        basePrice: product.basePrice,
        salePrice: product.salePrice,
        stock: product.stock,
        featured: !originalFeatured,
        active: product.active,
        categoryId: product.category?.id,
        brandId: product.brand?.id,
        images: product.images?.map(img => ({
          url: img.url,
          isPrimary: img.isPrimary || img.primary || false
        })) || []
      };
      await adminApi.updateProduct(product.id, updatedPayload);
      message.success(`${originalFeatured ? 'Bỏ' : 'Thêm'} sản phẩm nổi bật thành công`);
    } catch (err) {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, featured: originalFeatured } : p));
      console.error(err);
      message.error('Không thể cập nhật sản phẩm');
    }
  };

  const handleToggleActive = async (product) => {
    const originalActive = product.active;
    // Optimistic Update
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, active: !originalActive } : p));
    try {
      const updatedPayload = {
        name: product.name,
        modelCode: product.modelCode,
        sku: product.sku,
        detail: product.detail,
        basePrice: product.basePrice,
        salePrice: product.salePrice,
        stock: product.stock,
        featured: product.featured,
        active: !originalActive,
        categoryId: product.category?.id,
        brandId: product.brand?.id,
        images: product.images?.map(img => ({
          url: img.url,
          isPrimary: img.isPrimary || img.primary || false
        })) || []
      };
      await adminApi.updateProduct(product.id, updatedPayload);
      message.success(`Đã ${originalActive ? 'tắt' : 'bật'} kinh doanh sản phẩm`);
    } catch (err) {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, active: originalActive } : p));
      console.error(err);
      message.error('Không thể cập nhật trạng thái kinh doanh');
    }
  };

  const formatVND = (value) => {
    if (value === undefined || value === null) return '0 đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      key: 'images',
      width: 80,
      render: (images) => {
        const primaryImg = images?.find(i => i.isPrimary) || images?.[0];
        return primaryImg ? (
          <img src={primaryImg.url} alt="Sản phẩm" width={48} height={48} style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #f1f5f9' }} loading="lazy" />
        ) : (
          <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', color: '#94a3b8', borderRadius: '4px', fontSize: '11px' }}>No Img</div>
        );
      }
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Model: <Tag color="blue" size="small">{record.modelCode}</Tag>
            {record.category && <span style={{ marginLeft: 8 }}>DM: <strong>{record.category.name}</strong></span>}
          </div>
        </div>
      )
    },
    {
      title: 'Giá niêm yết / Bán',
      key: 'price',
      render: (_, record) => (
        <div>
          <div style={{ textDecoration: record.salePrice < record.basePrice ? 'line-through' : 'none', color: '#94a3b8', fontSize: '12px' }}>
            {formatVND(record.basePrice)}
          </div>
          <div style={{ fontWeight: 600, color: '#10b981' }}>
            {formatVND(record.salePrice)}
          </div>
        </div>
      )
    },
    {
      title: 'Kho / Bán',
      key: 'stock',
      render: (_, record) => (
        <div>
          <div>Tồn: <strong style={{ color: record.stock <= 10 ? '#ef4444' : '#1e293b' }}>{record.stock}</strong></div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Đã bán: <strong>{record.soldCount}</strong></div>
        </div>
      )
    },
    {
      title: 'Nổi bật',
      dataIndex: 'featured',
      key: 'featured',
      width: 100,
      align: 'center',
      render: (featured, record) => (
        <Button
          type="text"
          icon={featured ? <StarFilled style={{ color: '#f59e0b' }} /> : <StarOutlined style={{ color: '#94a3b8' }} />}
          onClick={() => handleToggleFeatured(record)}
        />
      )
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
          {record.active ? <Tag color="green">Đang kinh doanh</Tag> : <Tag color="default">Ngừng kinh doanh</Tag>}
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
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý sản phẩm"
        subtitle="Thêm mới, sửa đổi thông tin sản phẩm và quản lý tồn kho hàng hóa"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
            style={{ backgroundColor: '#0f172a', borderColor: '#0f172a', height: '40px', borderRadius: '8px' }}
          >
            Thêm sản phẩm
          </Button>
        }
      />

      <DataTableCard style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Input
            placeholder="Tìm kiếm theo tên hoặc mã model..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            allowClear
            size="large"
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: '280px' }}
          />
          <Select
            placeholder="Danh mục"
            allowClear
            size="large"
            style={{ width: '200px' }}
            onChange={(value) => {
              setSelectedCategory(value);
              setCurrentPage(1);
            }}
            options={categories.map(c => ({ label: c.name, value: c.id }))}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
          <Select
            placeholder="Thương hiệu"
            allowClear
            size="large"
            style={{ width: '160px' }}
            onChange={(value) => {
              setSelectedBrand(value);
              setCurrentPage(1);
            }}
            options={brands.map(b => ({ label: b.name, value: b.id }))}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
          <Select
            placeholder="Trạng thái"
            allowClear
            size="large"
            style={{ width: '160px' }}
            onChange={(value) => {
              setSelectedStatus(value);
              setCurrentPage(1);
            }}
            options={[
              { label: 'Đang kinh doanh', value: true },
              { label: 'Ngừng kinh doanh', value: false },
            ]}
          />
        </div>

        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên tổng số ${total} kết quả`,
            showSizeChanger: true,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }
          }}
        />
      </DataTableCard>

      <Drawer
        title={currentProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        width={1000}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        destroyOnClose
        styles={{ body: { paddingBottom: 80 } }}
      >
        <ProductForm
          visible={drawerVisible}
          initialValues={currentProduct}
          onSave={handleSave}
          onCancel={() => setDrawerVisible(false)}
          confirmLoading={saveLoading}
        />
      </Drawer>
    </div>
  );
};

export default ProductList;
