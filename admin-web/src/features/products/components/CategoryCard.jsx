import React from 'react';
import { Space, Button, Popconfirm, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, RightOutlined, DownOutlined, PictureOutlined } from '@ant-design/icons';

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

export default CategoryCard;
