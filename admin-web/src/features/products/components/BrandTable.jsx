import React from 'react';
import { Table, Space, Button, Switch, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const BrandTable = ({ brands, loading, onToggleActive, onEdit, onDelete }) => {
  const getStatusTag = (active) => {
    return active ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="default">Đang tạm dừng</Tag>;
  };

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
            onChange={() => onToggleActive(record)}
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
            onClick={() => onEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Xóa thương hiệu này?"
            onConfirm={() => onDelete(record.id)}
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
    <Table
      dataSource={brands}
      columns={brandColumns}
      rowKey="id"
      loading={loading}
      pagination={false}
    />
  );
};

export default BrandTable;
