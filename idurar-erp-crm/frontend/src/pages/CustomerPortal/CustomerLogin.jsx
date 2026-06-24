import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Col, Form, Input, Row, Tabs, Typography } from 'antd';
import { LockOutlined, MailOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import { customerLogin, customerRegister, selectCustomerAuth } from '@/redux/customerAuth';

const { Title, Text } = Typography;

export default function CustomerLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isLoggedIn } = useSelector(selectCustomerAuth);
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/customer-portal/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const onLogin = ({ email, password }) => {
    dispatch(customerLogin(email, password));
  };

  const onRegister = ({ name, email, password }) => {
    dispatch(customerRegister(name, email, password));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 10% 20%, rgba(244, 246, 255, 0.4) 0%, rgba(248, 250, 252, 1) 90%)',
        display: 'flex',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <Row gutter={[48, 48]} align="middle" style={{ width: '100%', maxWidth: 1040, margin: '0 auto' }} className="animate-fade-in">
        <Col xs={24} md={12}>
          <div style={{ maxWidth: 460 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              <SafetyCertificateOutlined style={{ color: '#fff', fontSize: 28 }} />
            </div>
            <Title style={{ marginBottom: 16, color: '#0f172a', fontWeight: 800, fontSize: '36px', letterSpacing: '-0.025em' }}>
              ManageX Customer Portal
            </Title>
            <Text style={{ display: 'block', color: '#475569', fontSize: 16, lineHeight: 1.7, fontWeight: 500 }}>
              Customers can sign in separately from admins to review invoices, quotes, payment history,
              account details, and recent billing activity.
            </Text>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: 24,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f1f5f9',
            }}
            bodyStyle={{ padding: 40 }}
          >
            <Title level={3} style={{ marginTop: 0, marginBottom: 8, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Customer access
            </Title>
            <Text style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Use the email linked to your customer record.</Text>

            {error && <Alert message={error} type="error" showIcon style={{ marginTop: 20 }} />}

            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              style={{ marginTop: 20 }}
              items={[
                {
                  key: 'login',
                  label: <span style={{ fontWeight: 600, fontSize: 15 }}>Login</span>,
                  children: (
                    <Form layout="vertical" onFinish={onLogin} size="large" style={{ marginTop: 8 }}>
                      <Form.Item
                        name="email"
                        label={<span style={{ fontWeight: 600, color: '#475569' }}>Email</span>}
                        rules={[{ required: true, type: 'email', message: 'Enter a valid email address' }]}
                      >
                        <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="customer@example.com" />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        label={<span style={{ fontWeight: 600, color: '#475569' }}>Password</span>}
                        rules={[{ required: true, message: 'Enter your password' }]}
                      >
                        <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="Password" />
                      </Form.Item>
                      <Button type="primary" htmlType="submit" block loading={isLoading} style={{ height: 44, borderRadius: 10 }}>
                        Login to portal
                      </Button>
                    </Form>
                  ),
                },
                {
                  key: 'register',
                  label: <span style={{ fontWeight: 600, fontSize: 15 }}>Register</span>,
                  children: (
                    <Form layout="vertical" onFinish={onRegister} size="large" style={{ marginTop: 8 }}>
                      <Form.Item
                        name="name"
                        label={<span style={{ fontWeight: 600, color: '#475569' }}>Full name</span>}
                        rules={[{ required: true, message: 'Enter your name' }]}
                      >
                        <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="Full name" />
                      </Form.Item>
                      <Form.Item
                        name="email"
                        label={<span style={{ fontWeight: 600, color: '#475569' }}>Email</span>}
                        rules={[{ required: true, type: 'email', message: 'Enter a valid email address' }]}
                      >
                        <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="customer@example.com" />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        label={<span style={{ fontWeight: 600, color: '#475569' }}>Password</span>}
                        rules={[{ required: true, min: 6, message: 'Use at least 6 characters' }]}
                      >
                        <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="Create password" />
                      </Form.Item>
                      <Form.Item
                        name="confirmPassword"
                        label={<span style={{ fontWeight: 600, color: '#475569' }}>Confirm password</span>}
                        dependencies={['password']}
                        rules={[
                          { required: true, message: 'Confirm your password' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) return Promise.resolve();
                              return Promise.reject(new Error('Passwords do not match'));
                            },
                          }),
                        ]}
                      >
                        <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="Confirm password" />
                      </Form.Item>
                      <Button type="primary" htmlType="submit" block loading={isLoading} style={{ height: 44, borderRadius: 10 }}>
                        Create customer account
                      </Button>
                    </Form>
                  ),
                },
              ]}
            />

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Text style={{ color: '#94a3b8', fontWeight: 500 }}>
                Admin user? <Link to="/login" style={{ fontWeight: 600, color: '#4f46e5' }}>Go to admin login</Link>
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
