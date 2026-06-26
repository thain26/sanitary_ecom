import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Switch, message, Popconfirm, Tabs, Card, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagsOutlined, ShopOutlined, RightOutlined, DownOutlined, PictureOutlined } from '@ant-design/icons';
import { adminApi } from '../../../services/api';
import PageHeader from '../../../components/common/PageHeader';
import DataTableCard from '../../../components/common/DataTableCard';

const { TextArea } = Input;

const CategoryCard = ({ category, level = 0, onEdit, onDelete, onToggle, onToggleExpand, expandedRowKeys }) => {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedRowKeys.includes(category.id);

  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        marginLeft: `${level * 40}px`,
        transition: 'all 0.2s',
      }}>
        {/* Left: Icon & Name */}
        <div style={{ display: 'flex', alignItems: 'center', width: '350px' }}>
          <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
            {hasChildren && (
              <button type="button" onClick={() => onToggleExpand(category.id)} style={{ cursor: 'pointer', color: '#64748b', padding: '4px', background: 'none', border: 'none', display: 'inline-flex', alignItems: 'center', outline: 'none' }} className="focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
                {isExpanded ? <DownOutlined style={{ fontSize: '12px' }} /> : <RightOutlined style={{ fontSize: '12px' }} />}
              </button>
            )}
          </div>
          {category.imageUrl ? (
            <img src={category.imageUrl} alt="cat" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', margin: '0 12px' }} />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: 6, backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', margin: '0 12px' }}>
              <PictureOutlined style={{ fontSize: '16px' }} />
            </div>
          )}
          <strong style={{ color: '#0f172a', fontSize: '14px', fontWeight: 600 }}>
            {category.name}
          </strong>
        </div>

        {/* Center: Slug & Desc */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '50%', paddingRight: '16px' }}>
            <code style={{ color: '#64748b', fontSize: '13px', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', verticalAlign: 'middle' }}>/{category.slug}</code>
          </div>
          <div style={{ width: '50%', color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '16px' }}>
            {category.description || <span style={{ color: '#cbd5e1' }}>Không có mô tả</span>}
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', width: '200px', justifyContent: 'flex-end' }}>
          <div style={{ width: '60px', textAlign: 'center', marginRight: '24px' }}>
            <Switch checked={category.active} size="small" onChange={() => onToggle(category)} checkedChildren="Bật" unCheckedChildren="Tắt" />
          </div>
          <div style={{ width: '65px', textAlign: 'right' }}>
            <Space size="small">
              <Button type="text" icon={<EditOutlined style={{ color: '#4f46e5' }} />} onClick={() => onEdit(category)} />
              <Popconfirm title="Xóa danh mục này?" description="Các sản phẩm thuộc danh mục này sẽ mất phân loại gốc." onConfirm={() => onDelete(category.id)} okText="Đồng ý" cancelText="Hủy" okButtonProps={{ danger: true }}>
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div style={{ marginTop: '8px' }}>
          {category.children.map(child => (
            <CategoryCard
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
              onToggleExpand={onToggleExpand}
              expandedRowKeys={expandedRowKeys}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryList = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  // Category Modal state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [catForm] = Form.useForm();
  const [catSaveLoading, setCatSaveLoading] = useState(false);

  // Brand Modal state
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [brandForm] = Form.useForm();
  const [brandSaveLoading, setBrandSaveLoading] = useState(false);

  // Expanded row keys for category tree
  const [expandedRowKeys, setExpandedRowKeys] = useState(() => {
    const saved = sessionStorage.getItem('categoryExpandedKeys');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('categoryExpandedKeys', JSON.stringify(expandedRowKeys));
  }, [expandedRowKeys]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === '1') {
        const data = await adminApi.getCategories();
        setCategories(data);
        // Trạng thái xổ (expand) được lưu trong sessionStorage, không tự động xổ tất cả nữa
      } else {
        const data = await adminApi.getBrands();
        setBrands(data);
      }
    } catch (err) {
      console.error(err);
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CATEGORIES LOGIC
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const getParentOptions = () => {
    return categories.filter(c => c.active && (!currentCategory || c.id !== currentCategory.id));
  };

  // Convert flat categories list to hierarchical tree for Ant Design Table
  const categoryTree = React.useMemo(() => {
    if (!categories || categories.length === 0) return [];

    const map = new Map();
    const tree = [];

    categories.forEach(item => {
      map.set(item.id, { ...item, children: [] });
    });

    categories.forEach(item => {
      if (item.parentId) {
        const parent = map.get(item.parentId);
        if (parent) {
          parent.children.push(map.get(item.id));
        } else {
          tree.push(map.get(item.id));
        }
      } else {
        tree.push(map.get(item.id));
      }
    });

    const cleanTree = (nodes) => {
      nodes.forEach(node => {
        // sort children alphabetically
        node.children.sort((a, b) => a.name.localeCompare(b.name));

        if (node.children.length === 0) {
          delete node.children;
        } else {
          cleanTree(node.children);
        }
      });
      return nodes;
    };

    // sort root tree
    tree.sort((a, b) => a.name.localeCompare(b.name));
    return cleanTree(tree);
  }, [categories]);

  const handleOpenCatCreate = () => {
    setCurrentCategory(null);
    catForm.resetFields();
    catForm.setFieldsValue({ active: true });
    setIsCatModalOpen(true);
  };

  const handleOpenCatEdit = (category) => {
    setCurrentCategory(category);
    catForm.resetFields();
    catForm.setFieldsValue({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      parentId: category.parentId,
      active: category.active
    });
    setIsCatModalOpen(true);
  };

  const handleSaveCat = async () => {
    try {
      const values = await catForm.validateFields();
      setCatSaveLoading(true);
      const payload = { ...values };

      if (currentCategory) {
        if (values.parentId === currentCategory.id) {
          message.error('Danh mục cha không thể chính là danh mục hiện tại!');
          setCatSaveLoading(false);
          return;
        }
        await adminApi.updateCategory(currentCategory.id, payload);
        message.success('Cập nhật danh mục thành công');
      } else {
        await adminApi.createCategory(payload);
        message.success('Thêm danh mục thành công');
      }
      setIsCatModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi lưu danh mục');
    } finally {
      setCatSaveLoading(false);
    }
  };

  const handleDeleteCat = async (id) => {
    try {
      await adminApi.deleteCategory(id);
      message.success('Xóa danh mục thành công');
      fetchData();
    } catch (err) {
      console.error(err);
      message.error('Không thể xóa danh mục');
    }
  };

  const handleToggleCatActive = async (category) => {
    const originalActive = category.active;
    // Optimistic Update
    setCategories(prev => prev.map(c => c.id === category.id ? { ...c, active: !originalActive } : c));
    try {
      const payload = {
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        parentId: category.parentId,
        active: !originalActive
      };
      await adminApi.updateCategory(category.id, payload);
      message.success(`Đã ${originalActive ? 'tắt' : 'bật'} danh mục`);
    } catch (err) {
      setCategories(prev => prev.map(c => c.id === category.id ? { ...c, active: originalActive } : c));
      console.error(err);
      message.error('Lỗi cập nhật trạng thái');
    }
  };

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // BRANDS LOGIC
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const handleOpenBrandCreate = () => {
    setCurrentBrand(null);
    brandForm.resetFields();
    brandForm.setFieldsValue({ active: true });
    setIsBrandModalOpen(true);
  };

  const handleOpenBrandEdit = (brand) => {
    setCurrentBrand(brand);
    brandForm.resetFields();
    brandForm.setFieldsValue({
      name: brand.name,
      description: brand.description,
      logoUrl: brand.logoUrl,
      active: brand.active
    });
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = async () => {
    try {
      const values = await brandForm.validateFields();
      setBrandSaveLoading(true);

      if (currentBrand) {
        await adminApi.updateBrand(currentBrand.id, values);
        message.success('Cập nhật thương hiệu thành công');
      } else {
        await adminApi.createBrand(values);
        message.success('Thêm thương hiệu thành công');
      }
      setIsBrandModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi lưu thương hiệu');
    } finally {
      setBrandSaveLoading(false);
    }
  };

  const handleDeleteBrand = async (id) => {
    try {
      await adminApi.deleteBrand(id);
      message.success('Xóa thương hiệu thành công');
      fetchData();
    } catch (err) {
      console.error(err);
      message.error('Không thể xóa thương hiệu');
    }
  };

  const handleToggleBrandActive = async (brand) => {
    const originalActive = brand.active;
    // Optimistic Update
    setBrands(prev => prev.map(b => b.id === brand.id ? { ...b, active: !originalActive } : b));
    try {
      const payload = {
        name: brand.name,
        description: brand.description,
        logoUrl: brand.logoUrl,
        active: !originalActive
      };
      await adminApi.updateBrand(brand.id, payload);
      message.success(`Đã ${originalActive ? 'tắt' : 'bật'} thương hiệu`);
    } catch (err) {
      setBrands(prev => prev.map(b => b.id === brand.id ? { ...b, active: originalActive } : b));
      console.error(err);
      message.error('Lỗi cập nhật trạng thái');
    }
  };

  // Lookups helpers
  const getParentName = (parentId) => {
    if (!parentId) return '-';
    const parent = categories.find(c => c.id === parentId);
    return parent ? parent.name : '-';
  };

  const getStatusTag = (active) => {
    return active ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="default">Đang tạm dừng</Tag>;
  };


  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // COLUMNS DEFINITIONS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const categoryColumns = [
    {
      title: 'HÌNH ẢNH',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      render: (url) => url ? (
        <img src={url} alt="Category" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
      ) : (
        <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', color: '#cbd5e1', borderRadius: '6px', fontSize: '16px' }}>
          <PictureOutlined />
        </div>
      )
    },
    {
      title: 'TÊN DANH MỤC',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <strong style={{ color: record.children && record.children.length > 0 ? '#2563eb' : '#334155' }}>{text}</strong>
    },
    {
      title: 'ĐƯỜNG DẪN',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug) => <code>/{slug}</code>
    },
    {
      title: 'MÔ TẢ',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'DANH MỤC CHA',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId) => getParentName(parentId)
    },
    {
      title: 'THỨ TỰ',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      sorter: (a, b) => a.sortOrder - b.sortOrder,
      width: 100,
      align: 'center'
    },
    {
      title: 'TRẠNG THÁI HOẠT ĐỘNG',
      key: 'status',
      width: 250,
      render: (_, record) => (
        <Space size="middle">
          <Switch
            checked={record.active}
            size="small"
            onChange={() => handleToggleCatActive(record)}
            checkedChildren="Bật"
            unCheckedChildren="Tắt"
          />
          {getStatusTag(record.active)}
        </Space>
      )
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#3b82f6' }} />}
            onClick={() => handleOpenCatEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Ngừng kích hoạt danh mục này?"
            description="Các sản phẩm thuộc danh mục này sẽ mất phân loại gốc."
            onConfirm={() => handleDeleteCat(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined style={{ color: '#ef4444' }} />} size="small" />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const brandColumns = [
    {
      title: 'Logo',
      dataIndex: 'logoUrl',
      key: 'logoUrl',
      width: 100,
      render: (url) => url ? (
        <img src={url} alt="Brand logo" style={{ width: '60px', height: '30px', objectFit: 'contain', borderRadius: '4px', backgroundColor: '#f8fafc', padding: '2px', border: '1px solid #e2e8f0' }} />
      ) : (
        <div style={{ width: '60px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', color: '#94a3b8', borderRadius: '4px', fontSize: '11px' }}>No logo</div>
      )
    },
    {
      title: 'Tên thương hiệu',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong style={{ color: '#0f172a' }}>{text}</strong>
    },
    {
      title: 'Đường dẫn (Slug)',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug) => <code>/{slug}</code>
    },
    {
      title: 'Mô tả chi tiết',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
            onChange={() => handleToggleBrandActive(record)}
            checkedChildren="Bật"
            unCheckedChildren="Tắt"
          />
          {getStatusTag(record.active)}
        </Space>
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#3b82f6' }} />}
            onClick={() => handleOpenBrandEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Xóa thương hiệu này?"
            onConfirm={() => handleDeleteBrand(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined style={{ color: '#ef4444' }} />} size="small" />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Quản lý danh mục sản phẩm</h1>
          <p className="page-subtitle">Thiết lập danh mục sản phẩm và thương hiệu phân phối chính hãng</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={activeTab === '1' ? handleOpenCatCreate : handleOpenBrandCreate}
          style={{ backgroundColor: '#0f172a', borderColor: '#0f172a', height: '40px', borderRadius: '8px' }}
        >
          {activeTab === '1' ? 'Thêm danh mục' : 'Thêm thương hiệu'}
        </Button>
      </div>

      <DataTableCard>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: '1',
              label: (
                <span>
                  <TagsOutlined />
                  Danh mục sản phẩm
                </span>
              ),
              children: (
                <div style={{ padding: '8px 0' }}>
                  {/* Tiêu đọcác cột */}
                  {categoryTree.length > 0 && !loading && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      marginBottom: '12px',
                      color: '#0f172a',
                      fontSize: '14px',
                      fontWeight: '600',
                      borderBottom: '1px solid #f0f0f0',
                    }}>
                      <div style={{ width: '350px' }}>
                        <span style={{ marginLeft: '64px' }}>Hình ảnh / Tên danh mục</span>
                      </div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '50%' }}>Đường dẫn (Slug)</div>
                        <div style={{ width: '50%' }}>Mô tả chi tiết</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', width: '200px', justifyContent: 'flex-end' }}>
                        <div style={{ width: '60px', textAlign: 'center', marginRight: '24px' }}>Trạng thái</div>
                        <div style={{ width: '65px', textAlign: 'right' }}>Hành động</div>
                      </div>
                    </div>
                  )}

                  {loading && activeTab === '1' ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>Đang tải dữ liệu...</div>
                  ) : categoryTree.length > 0 ? (
                    categoryTree.map(cat => (
                      <CategoryCard
                        key={cat.id}
                        category={cat}
                        level={0}
                        onEdit={handleOpenCatEdit}
                        onDelete={handleDeleteCat}
                        onToggle={handleToggleCatActive}
                        onToggleExpand={(id) => {
                          setExpandedRowKeys(prev =>
                            prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
                          )
                        }}
                        expandedRowKeys={expandedRowKeys}
                      />
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>Chưa có danh mục nào</div>
                  )}
                </div>
              )
            },
            {
              key: '2',
              label: (
                <span>
                  <ShopOutlined />
                  Thương hiệu (Brands)
                </span>
              ),
              children: (
                <Table
                  dataSource={brands}
                  columns={brandColumns}
                  rowKey="id"
                  loading={loading && activeTab === '2'}
                  pagination={false}
                />
              )
            }
          ]}
        />
      </DataTableCard>

      {/* Category Modal */}
      <Modal
        title={currentCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
        open={isCatModalOpen}
        onOk={handleSaveCat}
        onCancel={() => setIsCatModalOpen(false)}
        confirmLoading={catSaveLoading}
        okText="Lưu lại"
        cancelText="Hủy bỏ"
        okButtonProps={{ style: { backgroundColor: '#0f172a', borderColor: '#0f172a' } }}
      >
        <Form
          form={catForm}
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
              {getParentOptions().map(cat => (
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

      {/* Brand Modal */}
      <Modal
        title={currentBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
        open={isBrandModalOpen}
        onOk={handleSaveBrand}
        onCancel={() => setIsBrandModalOpen(false)}
        confirmLoading={brandSaveLoading}
        okText="Lưu lại"
        cancelText="Hủy bỏ"
        okButtonProps={{ style: { backgroundColor: '#0f172a', borderColor: '#0f172a' } }}
      >
        <Form
          form={brandForm}
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
            <TextArea rows={3} placeholder="Nhập mô tả vọthương hiệu..." />
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
    </div>
  );
};

export default CategoryList;
