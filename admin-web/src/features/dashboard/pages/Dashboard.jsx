import { message } from '../../../utils/AntdGlobalContext';
﻿import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Alert, Tag, Spin, Space, Button } from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  InboxOutlined,
  WarningOutlined,
  FireOutlined,
  FileExcelOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { adminApi } from '../../../services/api';
import PageHeader from '../../../components/common/PageHeader';
import StatCard from '../../../components/common/StatCard';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const handleExportExcel = async () => {
    setExportingExcel(true);
    try {
      const blob = await adminApi.exportRevenueExcel();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bao_cao_doanh_thu_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success('Xuất báo cáo Excel thành công!');
    } catch (err) {
      console.error(err);
      message.error('Không thể xuất báo cáo Excel.');
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportPdf = async () => {
    setExportingPdf(true);
    try {
      const blob = await adminApi.exportRevenuePdf();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bao_cao_doanh_thu_${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success('Xuất báo cáo PDF thành công!');
    } catch (err) {
      console.error(err);
      message.error('Không thể xuất báo cáo PDF.');
    } finally {
      setExportingPdf(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError('Không thể lấy dữ liệu thống kê từ server. Vui lòng kiểm tra lại kết nối backend.');
    } finally {
      setLoading(false);
    }
  };

  const formatVND = (value) => {
    if (value === undefined || value === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Đang tải dữ liệu thống kê...">
          <div style={{ padding: 50 }} />
        </Spin>
      </div>
    );
  }

  if (error) {
    return <Alert message="Lỗi hệ thống" description={error} type="error" showIcon style={{ borderRadius: '8px' }} />;
  }

  // Transform order status counts for PieChart
  const COLORS = ['#6366f1', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
  const statusLabels = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPING: 'Đang giao hàng',
    DELIVERED: 'Đã giao hàng',
    CANCELLED: 'Đã hủy đơn'
  };

  const pieData = stats?.orderStatusCounts ? Object.entries(stats.orderStatusCounts).map(([key, value]) => ({
    name: statusLabels[key] || key,
    value: Number(value)
  })) : [];

  const topProductColumns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong style={{ color: '#1e293b' }}>{text}</strong>
    },
    {
      title: 'Mã Model',
      dataIndex: 'modelCode',
      key: 'modelCode',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Đã bán',
      dataIndex: 'soldCount',
      key: 'soldCount',
      sorter: (a, b) => a.soldCount - b.soldCount,
      render: (count) => (
        <span style={{ fontWeight: 600, color: '#4f46e5' }}>
          <FireOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />
          {count}
        </span>
      )
    },
    {
      title: 'Giá bán',
      dataIndex: 'salePrice',
      key: 'salePrice',
      render: (price) => formatVND(price)
    }
  ];

  const lowStockColumns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mã Model',
      dataIndex: 'modelCode',
      key: 'modelCode',
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <span style={{ fontWeight: 700, color: '#ef4444' }}>
          <WarningOutlined style={{ marginRight: 4 }} />
          {stock} chiếc
        </span>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Tổng quan doanh nghiệp"
        subtitle="Xem báo cáo doanh số, đơn hàng và tình trạng kinh doanh hiện tại"
        extra={
          <>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={handleExportExcel}
              loading={exportingExcel}
              style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
            >
              Xuất Excel
            </Button>
            <Button
              type="primary"
              danger
              icon={<FilePdfOutlined />}
              onClick={handleExportPdf}
              loading={exportingPdf}
              style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
            >
              Xuất PDF
            </Button>
          </>
        }
      />

      {/* Row of Stat Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Doanh thu tổng"
            value={stats?.totalRevenue || 0}
            formatter={formatVND}
            valueColor="#10b981"
            icon={<DollarOutlined style={{ marginRight: 8 }} />}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng Đơn Hàng"
            value={stats?.totalOrders || 0}
            valueColor="#6366f1"
            icon={<ShoppingCartOutlined style={{ marginRight: 8 }} />}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Khách hàng"
            value={stats?.totalCustomers || 0}
            valueColor="#f59e0b"
            icon={<UserOutlined style={{ marginRight: 8 }} />}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Sản Phẩm"
            value={stats?.totalProducts || 0}
            valueColor="#3b82f6"
            icon={<InboxOutlined style={{ marginRight: 8 }} />}
          />
        </Col>
      </Row>

      {/* Graphs */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Biểu đồ Doanh Thu Theo Tháng" variant="borderless" style={{ height: '400px' }}>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats?.monthlyRevenue || []}
                  margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v}
                  />
                  <Tooltip
                    formatter={(value) => [formatVND(value), 'Doanh thu']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Trạng Thái Đơn Hàng" variant="borderless" style={{ height: '400px' }}>
            <div style={{ width: '100%', height: '240px', display: 'flex', justifyContent: 'center' }}>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Đơn hàng']} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>Chưa có dữ liệu đơn hàng</div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Grid of Tables */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Top 5 Sản Phẩm Bán Chạy" variant="borderless">
            <Table
              dataSource={stats?.topProducts || []}
              columns={topProductColumns}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Cảnh Báo Hết Hàng (Tồn Kho <= 10)" variant="borderless">
            <Table
              dataSource={stats?.lowStockProducts || []}
              columns={lowStockColumns}
              rowKey="id"
              pagination={false}
              size="middle"
              locale={{ emptyText: 'Tất cả sản phẩm đều đủ hàng tồn kho.' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
