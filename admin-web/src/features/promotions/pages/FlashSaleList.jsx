import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Switch, message, Popconfirm, Tag, Drawer, Card, Statistic, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, FireOutlined } from '@ant-design/icons';
import { adminApi } from '../../../services/api';
import FlashSaleModal from '../components/FlashSaleModal';
import FlashSaleProductEditModal from '../components/FlashSaleProductEditModal';
import ProductSelectorForm from '../components/ProductSelectorForm';

const FlashSaleList = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [loading, setLoading] = useState(false);

  // Campaign Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [form] = Form.useForm();
  const [saveLoading, setSaveLoading] = useState(false);

  // Product Drawer state
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [fsProducts, setFsProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Add Product Form state
  const [productForm] = Form.useForm();
  const [searchProducts, setSearchProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addProductLoading, setAddProductLoading] = useState(false);

  // Edit Flash Sale Product state
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingFsProduct, setEditingFsProduct] = useState(null);
  const [editProductForm] = Form.useForm();
  const [saveProductLoading, setSaveProductLoading] = useState(false);

  useEffect(() => {
    fetchFlashSales();
  }, []);

  const fetchFlashSales = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getFlashSales();
      setFlashSales(data);
    } catch (err) {
      console.error(err);
      message.error('Không thể lấy danh sách chương trình Flash Sale');
    } finally {
      setLoading(false);
    }
  };

  const toLocalISOString = (dateObj) => {
    if (!dateObj) return '';
    const tzOffset = dateObj.getTimezoneOffset() * 60000;
    return new Date(dateObj.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const handleOpenCreate = () => {
    setCurrentSale(null);
    form.resetFields();

    const now = new Date();
    const future = new Date();
    future.setHours(now.getHours() + 4); // default 4 hours campaign

    form.setFieldsValue({
      name: 'Sự kiện Flash Sale ' + now.toLocaleDateString('vi-VN'),
      isActive: true,
      startTime: toLocalISOString(now),
      endTime: toLocalISOString(future),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sale) => {
    setCurrentSale(sale);
    form.resetFields();

    const startStr = sale.startTime ? toLocalISOString(new Date(sale.startTime)) : '';
    const endStr = sale.endTime ? toLocalISOString(new Date(sale.endTime)) : '';

    form.setFieldsValue({
      name: sale.name,
      active: sale.active,
      startTime: startStr,
      endTime: endStr
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaveLoading(true);

      const payload = {
        name: values.name,
        active: values.active,
        startTime: values.startTime ? new Date(values.startTime).toISOString() : null,
        endTime: values.endTime ? new Date(values.endTime).toISOString() : null,
      };

      if (currentSale) {
        await adminApi.updateFlashSale(currentSale.id, payload);
        message.success('Cập nhật Flash Sale thành công');
      } else {
        await adminApi.createFlashSale(payload);
        message.success('Tạo Flash Sale thành công');
      }
      setIsModalOpen(false);
      fetchFlashSales();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || 'Lỗi khi lưu chiến dịch');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteFlashSale(id);
      message.success('Xóa chiến dịch Flash Sale thành công');
      fetchFlashSales();
    } catch (err) {
      console.error(err);
      message.error('Không thể xóa Flash Sale');
    }
  };

  const handleToggleActive = async (sale) => {
    try {
      const payload = {
        name: sale.name,
        startTime: sale.startTime,
        endTime: sale.endTime,
        active: !sale.active
      };
      await adminApi.updateFlashSale(sale.id, payload);
      message.success(`Đã ${!sale.active ? 'Bật' : 'Tắt'} Flash Sale thành công`);
      fetchFlashSales();
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi cập nhật trạng thái hoạt động');
    }
  };

  // Manage Products Drawer logic
  const handleOpenProductsDrawer = (sale) => {
    setSelectedSale(sale);
    setDrawerVisible(true);
    fetchFlashSaleProducts(sale.id);
    loadSearchProducts('');
    productForm.resetFields();
  };

  const fetchFlashSaleProducts = async (saleId) => {
    setProductsLoading(true);
    try {
      const data = await adminApi.getFlashSaleProducts(saleId);
      setFsProducts(data);
    } catch (err) {
      console.error(err);
      message.error('Không thể lấy danh sách sản phẩm Flash Sale');
    } finally {
      setProductsLoading(false);
    }
  };

  const loadSearchProducts = async (keyword) => {
    setSearchLoading(true);
    try {
      const data = await adminApi.getProducts({ page: 0, size: 50, keyword });
      setSearchProducts(data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const values = await productForm.validateFields();
      setAddProductLoading(true);

      const payload = {
        productId: values.productId,
        salePrice: values.salePrice,
        quantityLimit: values.quantityLimit
      };

      await adminApi.addProductToFlashSale(selectedSale.id, payload);
      message.success('Đã thêm sản phẩm vào Flash Sale thành công');
      productForm.resetFields();
      fetchFlashSaleProducts(selectedSale.id);
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || 'Có lỗi xảy ra khi thêm sản phẩm');
    } finally {
      setAddProductLoading(false);
    }
  };

  const handleRemoveProduct = async (fsProductId) => {
    try {
      await adminApi.removeProductFromFlashSale(selectedSale.id, fsProductId);
      message.success('Đã gỡ sản phẩm khỏi Flash Sale');
      fetchFlashSaleProducts(selectedSale.id);
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi gỡ sản phẩm');
    }
  };

  const handleOpenEditProduct = (record) => {
    setEditingFsProduct(record);
    editProductForm.setFieldsValue({
      salePrice: record.salePrice,
      quantityLimit: record.quantityLimit,
      soldCount: record.soldCount
    });
    setIsEditProductModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      const values = await editProductForm.validateFields();
      setSaveProductLoading(true);

      const payload = {
        salePrice: values.salePrice,
        quantityLimit: values.quantityLimit,
        soldCount: values.soldCount
      };

      await adminApi.updateFlashSaleProduct(selectedSale.id, editingFsProduct.id, payload);
      message.success('Cập nhật sản phẩm Flash Sale thành công');
      setIsEditProductModalOpen(false);
      fetchFlashSaleProducts(selectedSale.id);
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi cập nhật sản phẩm Flash Sale');
    } finally {
      setSaveProductLoading(false);
    }
  };

  const formatVND = (value) => {
    if (value === undefined || value === null) return '0 â‚«';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getCampaignStatus = (record) => {
    const now = new Date();
    const start = new Date(record.startTime);
    const end = new Date(record.endTime);

    if (!record.active) {
      return <Tag color="default">Đang tạm dừng</Tag>;
    }
    if (now < start) {
      return <Tag color="blue">Sắp diễn ra</Tag>;
    }
    if (now > end) {
      return <Tag color="red">Đã kết thúc</Tag>;
    }
    return <Tag color="gold"><FireOutlined style={{ marginRight: 4 }} />Đang diễn ra</Tag>;
  };

  const columns = [
    {
      title: 'Tên chiến dịch',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong style={{ color: '#0f172a' }}>{text}</strong>
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time) => new Date(time).toLocaleString('vi-VN')
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (time) => new Date(time).toLocaleString('vi-VN')
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
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            icon={<SettingOutlined />}
            size="small"
            onClick={() => handleOpenProductsDrawer(record)}
          >
            Sản phẩm
          </Button>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#4f46e5' }} />}
            onClick={() => handleOpenEdit(record)}
          />
          <Popconfirm
            title="Xóa chương trình Flash Sale này?"
            description="Tất cả thiết lập giảm giá của các sản phẩm thuộc chiến dịch này sẽ bị mất."
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

  const productColumns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{record.name}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>
            Model: <Tag color="blue" size="small">{record.modelCode}</Tag>
          </div>
        </div>
      )
    },
    {
      title: 'Giá niêm yết',
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: (val) => formatVND(val)
    },
    {
      title: 'Giá Flash Sale',
      dataIndex: 'salePrice',
      key: 'salePrice',
      render: (val) => <strong style={{ color: '#e05a47' }}>{formatVND(val)}</strong>
    },
    {
      title: 'Giới hạn bán',
      key: 'limit',
      render: (_, record) => (
        <span>{record.soldCount} / {record.quantityLimit || 'Không giới hạn'}</span>
      )
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Hành động',
      key: 'productActions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#4f46e5' }} />}
            onClick={() => handleOpenEditProduct(record)}
          />
          <Popconfirm
            title="Gỡ sản phẩm này khỏi Flash Sale?"
            onConfirm={() => handleRemoveProduct(record.id)}
            okText="Gỡ bỏ"
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
          <h1 className="page-title">Quản lý Flash Sales</h1>
          <p className="page-subtitle">Cấu hình các chương trình giảm giá chớp nhoáng theo khung giờ giới hạn</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreate}
          style={{ backgroundColor: '#0f172a', borderColor: '#0f172a', height: '40px', borderRadius: '8px' }}
        >
          Tạo chiến dịch mới
        </Button>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <Table
          dataSource={flashSales}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </div>

      {/* Campaign Detail / Edit Modal */}
      <FlashSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        loading={saveLoading}
        form={form}
        currentSale={currentSale}
      />

      {/* Manage Products Drawer */}
      <Drawer
        title={selectedSale ? `Cấu hình sản phẩm: ${selectedSale.name}` : "Cấu hình sản phẩm Flash Sale"}
        width={750}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        destroyOnClose
      >
        {selectedSale && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Status Summary */}
            <Card size="small" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic title="Khung giá" value={new Date(selectedSale.startTime).toLocaleTimeString('vi-VN') + ' - ' + new Date(selectedSale.endTime).toLocaleTimeString('vi-VN')} valueStyle={{ fontSize: '14px', fontWeight: 600 }} />
                </Col>
                <Col span={6}>
                  <Statistic title="Ngày chạy" value={new Date(selectedSale.startTime).toLocaleDateString('vi-VN')} valueStyle={{ fontSize: '14px', fontWeight: 600 }} />
                </Col>
                <Col span={6}>
                  <Statistic title="Tình trạng" value="" prefix={getCampaignStatus(selectedSale)} valueStyle={{ fontSize: '14px' }} />
                </Col>
              </Row>
            </Card>

            {/* Form to Add Product */}
            <ProductSelectorForm
              form={productForm}
              onAdd={handleAddProduct}
              onSearch={loadSearchProducts}
              searchLoading={searchLoading}
              searchResults={searchProducts}
              addLoading={addProductLoading}
            />

            {/* List of Products inside Flash Sale */}
            <Table
              dataSource={fsProducts}
              columns={productColumns}
              rowKey="id"
              loading={productsLoading}
              size="middle"
              pagination={false}
              locale={{ emptyText: 'Chưa có sản phẩm nào được thiết lập Flash Sale.' }}
            />
          </div>
        )}
      </Drawer>

      {/* Edit Flash Sale Product Modal */}
      <FlashSaleProductEditModal
        isOpen={isEditProductModalOpen}
        onClose={() => setIsEditProductModalOpen(false)}
        onSave={handleSaveProduct}
        loading={saveProductLoading}
        form={editProductForm}
        editingProduct={editingFsProduct}
      />
    </div>
  );
};

export default FlashSaleList;
