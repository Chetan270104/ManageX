import { Typography, Row, Col, Spin, Tooltip } from 'antd';
import { useMoney } from '@/settings';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

export default function AnalyticSummaryCard({ title, icon, data, prefix, isLoading = false, gradient }) {
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);
  return (
    <Col
      className="gutter-row"
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 12 }}
      lg={{ span: 6 }}
    >
      <div
        style={{ 
          background: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #f1f5f9',
          height: '100%',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
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
            background: 'rgba(79, 70, 229, 0.1)', 
            color: '#4f46e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            {icon}
          </div>
          <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {prefix}
          </Text>
        </div>
        
        <div>
          <Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>{title}</Text>
          <div style={{ marginTop: '4px' }}>
            {isLoading ? (
              <Spin size="small" />
            ) : (
              <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>
                {data
                  ? moneyFormatter({
                      amount: data,
                      currency_code: money_format_settings?.default_currency_code,
                    })
                  : moneyFormatter({
                      amount: 0,
                      currency_code: money_format_settings?.default_currency_code,
                    })}
              </Title>
            )}
          </div>
        </div>
      </div>
    </Col>
  );
}
