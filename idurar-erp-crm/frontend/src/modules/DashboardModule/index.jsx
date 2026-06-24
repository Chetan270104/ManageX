import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Tag, Row, Col, Button, Statistic, Typography, Spin, Tooltip, Divider } from 'antd';
const { Title, Text } = Typography;
import useLanguage from '@/locale/useLanguage';

import { useMoney } from '@/settings';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import useOnFetch from '@/hooks/useOnFetch';

import RecentTable from './components/RecentTable';

import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';

import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';
import {
  FileTextOutlined,
  ContainerOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UpOutlined,
  DownOutlined
} from '@ant-design/icons';

export default function DashboardModule() {
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const navigate = useNavigate();
  const money_format_settings = useSelector(selectMoneyFormat);

  const [showGuide, setShowGuide] = useState(() => {
    return localStorage.getItem('hide_dashboard_guide') !== 'true';
  });

  const toggleGuide = () => {
    const nextVal = !showGuide;
    setShowGuide(nextVal);
    localStorage.setItem('hide_dashboard_guide', String(!nextVal));
  };

  const getStatsData = async ({ entity, currency }) => {
    return await request.summary({
      entity,
      options: { currency },
    });
  };

  const {
    result: invoiceResult,
    isLoading: invoiceLoading,
    onFetch: fetchInvoicesStats,
  } = useOnFetch();

  const { result: quoteResult, isLoading: quoteLoading, onFetch: fetchQuotesStats } = useOnFetch();

  const {
    result: paymentResult,
    isLoading: paymentLoading,
    onFetch: fetchPayemntsStats,
  } = useOnFetch();

  const { result: clientResult, isLoading: clientLoading } = useFetch(() =>
    request.summary({ entity: 'client' })
  );

  useEffect(() => {
    const currency = money_format_settings.default_currency_code || null;

    if (currency) {
      fetchInvoicesStats(getStatsData({ entity: 'invoice', currency }));
      fetchQuotesStats(getStatsData({ entity: 'quote', currency }));
      fetchPayemntsStats(getStatsData({ entity: 'payment', currency }));
    }
  }, [money_format_settings.default_currency_code]);

  const dataTableColumns = [
    {
      title: translate('number'),
      dataIndex: 'number',
    },
    {
      title: translate('Client'),
      dataIndex: ['client', 'name'],
    },

    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
    },
  ];

  const entityData = [
    {
      result: invoiceResult,
      isLoading: invoiceLoading,
      entity: 'invoice',
      title: translate('Invoices'),
    },
    {
      result: quoteResult,
      isLoading: quoteLoading,
      entity: 'quote',
      title: translate('quote'),
    },
  ];

  const statisticCards = entityData.map((data, index) => {
    const { result, entity, isLoading, title } = data;

    return (
      <PreviewCard
        key={index}
        title={title}
        isLoading={isLoading}
        entity={entity}
        statistics={
          !isLoading &&
          result?.performance?.map((item) => ({
            tag: item?.status,
            color: 'blue',
            value: item?.percentage,
          }))
        }
      />
    );
  });

  if (money_format_settings) {
    return (
      <>
        <div style={{
          marginBottom: '40px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '32px',
          padding: '60px 48px',
          color: '#fff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#a5b4fc',
              padding: '8px 16px',
              borderRadius: '100px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '24px',
              display: 'inline-block',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
              Overview Dashboard
            </span>
            <h1 style={{ color: '#ffffff', margin: 0, fontSize: '48px', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1 }}>
              Welcome back, <span style={{ color: '#6366f1' }}>Admin</span>
            </h1>
            <p style={{ margin: '16px 0 0 0', fontSize: '18px', opacity: 0.8, fontWeight: 500, maxWidth: '600px', lineHeight: 1.6 }}>
              Your business is performing well today. We've compiled the latest metrics and recent activities for you to review.
            </p>
          </div>

          {/* Abstract Background Elements */}
          <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', left: '40%', bottom: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '32px',
          padding: '24px 32px',
          border: '1px solid #f1f5f9',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          marginBottom: '32px'
        }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              gap: 16,
            }}
            onClick={toggleGuide}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🚀</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  Business Flow Quick Start Guide
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  Follow these 4 simple steps to run your business with ManageX ERP
                </p>
              </div>
            </div>
            <Button
              type="text"
              shape="circle"
              icon={showGuide ? <UpOutlined /> : <DownOutlined />}
              onClick={toggleGuide}
            />
          </div>


          {showGuide && (
            <div style={{ marginTop: '24px' }}>
              <Divider style={{ margin: '0 0 24px 0' }} />
              <Row gutter={[20, 20]}>
                {/* Step 1: Customers */}
                <Col xs={24} sm={12} md={6}>
                  <div style={{
                    padding: '20px',
                    borderRadius: '20px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'rgba(79, 70, 229, 0.1)',
                          color: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px'
                        }}>1</span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>Add Customers</h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                        Create profiles for your clients to save their contact details, shipping addresses, and billing history.
                      </p>
                    </div>
                    <Button
                      type="primary"
                      style={{ borderRadius: '10px', marginTop: '8px', fontWeight: 600, background: '#4f46e5', borderColor: '#4f46e5', color: '#ffffff' }}
                      onClick={() => navigate('/customer')}
                    >
                      Go to Customers
                    </Button>
                  </div>
                </Col>

                {/* Step 2: Create Quotes */}
                <Col xs={24} sm={12} md={6}>
                  <div style={{
                    padding: '20px',
                    borderRadius: '20px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'rgba(79, 70, 229, 0.1)',
                          color: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px'
                        }}>2</span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>Send Quotes</h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                        Pitch prices or services to customers by issuing a Quote/Estimate. Clients can accept or reject them.
                      </p>
                    </div>
                    <Button
                      type="primary"
                      style={{ borderRadius: '10px', marginTop: '8px', fontWeight: 600, background: '#4f46e5', borderColor: '#4f46e5', color: '#ffffff' }}
                      onClick={() => navigate('/quote/create')}
                    >
                      Create Quote
                    </Button>
                  </div>
                </Col>

                {/* Step 3: Issue Invoices */}
                <Col xs={24} sm={12} md={6}>
                  <div style={{
                    padding: '20px',
                    borderRadius: '20px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'rgba(79, 70, 229, 0.1)',
                          color: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px'
                        }}>3</span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>Issue Invoices</h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                        Convert accepted Quotes to Invoices directly or create fresh Invoices. Track dues and tax values.
                      </p>
                    </div>
                    <Button
                      type="primary"
                      style={{ borderRadius: '10px', marginTop: '8px', fontWeight: 600, background: '#4f46e5', borderColor: '#4f46e5', color: '#ffffff' }}
                      onClick={() => navigate('/invoice/create')}
                    >
                      Create Invoice
                    </Button>
                  </div>
                </Col>

                {/* Step 4: Record Payments */}
                <Col xs={24} sm={12} md={6}>
                  <div style={{
                    padding: '20px',
                    borderRadius: '20px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'rgba(79, 70, 229, 0.1)',
                          color: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px'
                        }}>4</span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>Record Payments</h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                        Mark invoices as Paid or Partially Paid when clients pay. View cashflow live on your dashboard.
                      </p>
                    </div>
                    <Button
                      type="primary"
                      style={{ borderRadius: '10px', marginTop: '8px', fontWeight: 600, background: '#4f46e5', borderColor: '#4f46e5', color: '#ffffff' }}
                      onClick={() => navigate('/payment')}
                    >
                      Log Payment
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>

        <Row gutter={[24, 24]}>
          <SummaryCard
            title={translate('Invoices Revenue')}
            prefix={translate('This month')}
            isLoading={invoiceLoading}
            data={invoiceResult?.total}
            icon={<ContainerOutlined />}
          />
          <SummaryCard
            title={translate('Quotes Value')}
            prefix={translate('This month')}
            isLoading={quoteLoading}
            data={quoteResult?.total}
            icon={<FileTextOutlined />}
          />
          <SummaryCard
            title={translate('Total Received')}
            prefix={translate('This month')}
            isLoading={paymentLoading}
            data={paymentResult?.total}
            icon={<CheckCircleOutlined />}
          />
          <SummaryCard
            title={translate('Pending Payments')}
            prefix={translate('Not Paid')}
            isLoading={invoiceLoading}
            data={invoiceResult?.total_undue}
            icon={<ClockCircleOutlined />}
          />
        </Row>

        <div style={{ marginTop: '40px' }}></div>

        <Row gutter={[24, 24]}>
          <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }}>
            <div style={{
              background: '#fff',
              padding: '32px',
              borderRadius: '32px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              height: '100%'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ color: '#0f172a', margin: 0, fontSize: '22px', fontWeight: 800 }}>Performance Metrics</h3>
                <Tag color="blue" style={{ borderRadius: '100px', padding: '2px 12px', fontWeight: 600 }}>Real-time</Tag>
              </div>
              <Row gutter={[24, 24]}>
                {statisticCards}
              </Row>
            </div>
          </Col>
          <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
            <CustomerPreviewCard
              isLoading={clientLoading}
              activeCustomer={clientResult?.active}
              newCustomer={clientResult?.new}
            />
          </Col>
        </Row>

        <div style={{ marginTop: '40px' }}></div>

        <Row gutter={[24, 24]}>
          <Col className="gutter-row w-full" sm={{ span: 24 }} lg={{ span: 12 }}>
            <div style={{
              background: '#fff',
              padding: '32px',
              borderRadius: '32px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              height: '100%'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ color: '#0f172a', margin: 0, fontSize: '20px', fontWeight: 800 }}>
                  {translate('Recent Invoices')}
                </h3>
                <Button type="link" style={{ fontWeight: 600 }}>View All</Button>
              </div>

              <RecentTable entity={'invoice'} dataTableColumns={dataTableColumns} />
            </div>
          </Col>

          <Col className="gutter-row w-full" sm={{ span: 24 }} lg={{ span: 12 }}>
            <div style={{
              background: '#fff',
              padding: '32px',
              borderRadius: '32px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              height: '100%'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ color: '#0f172a', margin: 0, fontSize: '20px', fontWeight: 800 }}>
                  {translate('Recent Quotes')}
                </h3>
                <Button type="link" style={{ fontWeight: 600 }}>View All</Button>
              </div>
              <RecentTable entity={'quote'} dataTableColumns={dataTableColumns} />
            </div>
          </Col>
        </Row>
      </>
    );
  } else {
    return <></>;
  }
}
