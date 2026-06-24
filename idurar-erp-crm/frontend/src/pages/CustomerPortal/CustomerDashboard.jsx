import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Dropdown,
  Empty,
  Layout,
  Menu,
  Row,
  Spin,
  Table,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import {
  CreditCardOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { customerLogout, selectCustomerAuth } from '@/redux/customerAuth';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const API_BASE = import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:8888';

const money = (value = 0, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency === 'NA' ? 'INR' : currency,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const date = (value) => (value ? new Date(value).toLocaleDateString('en-IN') : '-');

function useCustomerData(token) {
  const [state, setState] = useState({
    loading: true,
    profile: null,
    summary: null,
    invoices: [],
    quotes: [],
    payments: [],
    error: null,
  });

  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };
    const fetchJson = (endpoint) =>
      fetch(`${API_BASE}/api/customer/${endpoint}`, { headers }).then((res) => res.json());

    setState((current) => ({ ...current, loading: true, error: null }));
    Promise.all([
      fetchJson('profile'),
      fetchJson('my-summary'),
      fetchJson('my-invoices'),
      fetchJson('my-quotes'),
      fetchJson('my-payments'),
    ])
      .then(([profile, summary, invoices, quotes, payments]) => {
        setState({
          loading: false,
          profile: profile.result || null,
          summary: summary.result || null,
          invoices: invoices.result || [],
          quotes: quotes.result || [],
          payments: payments.result || [],
          error: null,
        });
      })
      .catch(() => {
        setState((current) => ({
          ...current,
          loading: false,
          error: 'Unable to load customer data right now.',
        }));
      });
  }, [token]);

  return state;
}

const documentStatusColor = {
  draft: 'default',
  pending: 'gold',
  sent: 'blue',
  cancelled: 'red',
  refunded: 'purple',
  'on hold': 'orange',
};

const paymentStatusColor = {
  unpaid: 'red',
  partially: 'gold',
  paid: 'green',
};

export default function CustomerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customer, token } = useSelector(selectCustomerAuth);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const { loading, profile, summary, invoices, quotes, payments, error } = useCustomerData(token);

  const latestCurrency = invoices[0]?.currency || payments[0]?.currency || quotes[0]?.currency || 'INR';

  const activity = useMemo(() => {
    const invoiceItems = invoices.slice(0, 5).map((item) => ({
      key: `invoice-${item._id}`,
      date: item.date,
      children: `Invoice #${item.number} was ${item.paymentStatus || item.status || 'created'}`,
    }));
    const paymentItems = payments.slice(0, 5).map((item) => ({
      key: `payment-${item._id}`,
      date: item.date,
      color: 'green',
      children: `Payment #${item.number} recorded for ${money(item.amount, item.currency || latestCurrency)}`,
    }));
    return [...invoiceItems, ...paymentItems]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 6);
  }, [invoices, payments, latestCurrency]);

  const handleLogout = () => {
    dispatch(customerLogout());
    navigate('/customer-portal', { replace: true });
  };

  const invoiceColumns = [
    { title: 'Invoice', dataIndex: 'number', render: (value) => `#${value}` },
    { title: 'Issued', dataIndex: 'date', render: date },
    { title: 'Due', dataIndex: 'expiredDate', render: date },
    { title: 'Amount', dataIndex: 'total', align: 'right', render: (value, row) => money(value, row.currency) },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      render: (value = 'unpaid') => <Tag color={paymentStatusColor[value] || 'default'}>{value.toUpperCase()}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value = 'draft') => <Tag color={documentStatusColor[value] || 'default'}>{value.toUpperCase()}</Tag>,
    },
  ];

  const quoteColumns = [
    { title: 'Quote', dataIndex: 'number', render: (value) => `#${value}` },
    { title: 'Date', dataIndex: 'date', render: date },
    { title: 'Valid until', dataIndex: 'expiredDate', render: date },
    { title: 'Amount', dataIndex: 'total', align: 'right', render: (value, row) => money(value, row.currency) },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value = 'draft') => <Tag color={documentStatusColor[value] || 'default'}>{value.toUpperCase()}</Tag>,
    },
  ];

  const paymentColumns = [
    { title: 'Payment', dataIndex: 'number', render: (value) => `#${value}` },
    { title: 'Date', dataIndex: 'date', render: date },
    { title: 'Amount', dataIndex: 'amount', align: 'right', render: (value, row) => money(value, row.currency) },
    { title: 'Reference', dataIndex: 'ref', render: (value) => value || '-' },
    { title: 'Invoice', dataIndex: 'invoiceNumber', render: (value) => (value ? `#${value}` : '-') },
  ];

  const metricCards = [
    {
      title: 'Outstanding',
      value: money(summary?.outstandingAmount, summary?.currency || latestCurrency),
      tone: '#b42318',
      bgColor: 'rgba(180, 35, 24, 0.08)',
      icon: <ClockCircleOutlined style={{ fontSize: '20px', color: '#b42318' }} />
    },
    {
      title: 'Paid',
      value: money(summary?.paidAmount, summary?.currency || latestCurrency),
      tone: '#067647',
      bgColor: 'rgba(6, 118, 71, 0.08)',
      icon: <CheckCircleOutlined style={{ fontSize: '20px', color: '#067647' }} />
    },
    {
      title: 'Invoices',
      value: summary?.invoices || 0,
      tone: '#155eef',
      bgColor: 'rgba(21, 94, 239, 0.08)',
      icon: <FileTextOutlined style={{ fontSize: '20px', color: '#155eef' }} />
    },
    {
      title: 'Quotes',
      value: summary?.quotes || 0,
      tone: '#7a5af8',
      bgColor: 'rgba(122, 90, 248, 0.08)',
      icon: <FileDoneOutlined style={{ fontSize: '20px', color: '#7a5af8' }} />
    },
  ];

  const renderDashboard = () => (
    <>
      <Row gutter={[24, 24]}>
        {metricCards.map((item) => (
          <Col xs={24} sm={12} lg={6} key={item.title}>
            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #f1f5f9',
                height: '100%',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.05)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: item.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {item.icon}
                </div>
              </div>
              <div>
                <Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>{item.title}</Text>
                <div style={{ color: item.tone, fontSize: 26, fontWeight: 800, marginTop: 8, letterSpacing: '-0.02em' }}>
                  {loading ? <Spin size="small" /> : item.value}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title={<span style={{ fontWeight: 800, color: '#0f172a' }}>Recent invoices</span>} bordered={false} style={{ borderRadius: 20, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <Table
              dataSource={invoices.slice(0, 5)}
              columns={invoiceColumns}
              rowKey="_id"
              loading={loading}
              pagination={false}
              size="middle"
              locale={{ emptyText: <Empty description="No invoices yet" /> }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<span style={{ fontWeight: 800, color: '#0f172a' }}>Recent activity</span>} bordered={false} style={{ borderRadius: 20, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ padding: '8px 0' }}>
              {activity.length ? (
                <Timeline items={activity.map((item) => ({ ...item, label: <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>{date(item.date)}</span> }))} />
              ) : (
                <Empty description="No activity yet" />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderProfile = () => (
    <Card title={<span style={{ fontWeight: 800, color: '#0f172a' }}>Customer profile</span>} bordered={false} style={{ borderRadius: 20, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      <Descriptions bordered column={1} size="middle" labelStyle={{ fontWeight: 600, color: '#475569', background: '#f8fafc' }} contentStyle={{ color: '#0f172a', fontWeight: 500 }}>
        <Descriptions.Item label="Name">{profile?.name || customer?.name || '-'}</Descriptions.Item>
        <Descriptions.Item label="Email">{profile?.email || customer?.email || '-'}</Descriptions.Item>
        <Descriptions.Item label="Phone">{profile?.client?.phone || '-'}</Descriptions.Item>
        <Descriptions.Item label="Country">{profile?.client?.country || '-'}</Descriptions.Item>
        <Descriptions.Item label="Address">{profile?.client?.address || '-'}</Descriptions.Item>
        <Descriptions.Item label="Linked customer record">
          {profile?.client ? <Tag color="success" style={{ fontWeight: 600 }}>Linked</Tag> : <Tag color="warning" style={{ fontWeight: 600 }}>Awaiting admin link</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Account enabled">
          {profile?.enabled ? <Tag color="success" style={{ fontWeight: 600 }}>ACTIVE</Tag> : <Tag color="error" style={{ fontWeight: 600 }}>DISABLED</Tag>}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );

  const renderContent = () => {
    if (error) return <Card bordered={false} style={{ borderRadius: 20 }}>{error}</Card>;

    if (activeMenu === 'dashboard') return renderDashboard();
    if (activeMenu === 'invoices') {
      return (
        <Card title={<span style={{ fontWeight: 800, color: '#0f172a' }}>Invoice history</span>} bordered={false} style={{ borderRadius: 20, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <Table dataSource={invoices} columns={invoiceColumns} rowKey="_id" loading={loading} />
        </Card>
      );
    }
    if (activeMenu === 'quotes') {
      return (
        <Card title={<span style={{ fontWeight: 800, color: '#0f172a' }}>Quote history</span>} bordered={false} style={{ borderRadius: 20, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <Table dataSource={quotes} columns={quoteColumns} rowKey="_id" loading={loading} />
        </Card>
      );
    }
    if (activeMenu === 'payments') {
      return (
        <Card title={<span style={{ fontWeight: 800, color: '#0f172a' }}>Payment history</span>} bordered={false} style={{ borderRadius: 20, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <Table dataSource={payments} columns={paymentColumns} rowKey="_id" loading={loading} />
        </Card>
      );
    }
    return renderProfile();
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }} className="animate-fade-in">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        width={256}
        style={{
          overflow: 'visible',
          height: 'calc(100vh - 40px)',
          position: 'sticky',
          top: 20,
          left: 20,
          margin: '20px 0 20px 20px',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          borderRadius: '16px',
          borderRight: 'none',
        }}
      >
        <div style={{ height: 72, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', cursor: 'pointer' }} onClick={() => setActiveMenu('dashboard')}>
          <FileDoneOutlined style={{ color: '#4f46e5', fontSize: 26 }} />
          {!collapsed && (
            <span
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#1e293b',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.025em',
                background: 'linear-gradient(to right, #4f46e5, #6366f1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ManageX Portal
            </span>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeMenu]}
          onClick={({ key }) => setActiveMenu(key)}
          style={{ background: 'transparent', borderRight: 'none' }}
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
            { key: 'invoices', icon: <FileTextOutlined />, label: 'Invoices' },
            { key: 'quotes', icon: <FileDoneOutlined />, label: 'Quotes' },
            { key: 'payments', icon: <CreditCardOutlined />, label: 'Payments' },
            { key: 'profile', icon: <ProfileOutlined />, label: 'Profile' },
          ]}
        />
      </Sider>

      <Layout style={{ background: 'transparent' }}>
        <Header
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(12px)',
            padding: '0 40px',
            display: 'flex',
            height: 70,
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div>
            <Text style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Portal</Text>
            <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: -2 }}>
              Welcome, <span style={{ color: '#4f46e5' }}>{customer?.name || 'Customer'}</span>
            </Title>
          </div>
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { key: 'name', label: <span style={{ fontWeight: 600, color: '#0f172a' }}>{customer?.name || 'Customer'}</span>, disabled: true },
                { key: 'email', label: <span style={{ color: '#64748b', fontSize: '13px' }}>{customer?.email || ''}</span>, disabled: true },
                { type: 'divider' },
                { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true, onClick: handleLogout },
              ],
            }}
          >
            <Button type="text" style={{ height: 44, display: 'flex', alignItems: 'center', borderRadius: 10 }}>
              <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8, background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }} />
              {!collapsed && <span style={{ fontWeight: 600, color: '#475569' }}>{customer?.name || 'Customer'}</span>}
            </Button>
          </Dropdown>
        </Header>

        <Content style={{ padding: '40px', overflowY: 'auto' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}
