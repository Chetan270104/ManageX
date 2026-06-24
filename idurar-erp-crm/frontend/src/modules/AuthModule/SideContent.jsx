import { Layout, Typography, Space } from 'antd';
import logo from '@/style/images/logo-icon.svg';
import useLanguage from '@/locale/useLanguage';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  return (
    <Content
      style={{
        padding: '0 60px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            <img src={logo} alt="ManageX" style={{ height: '32px' }} />
          </div>
          <span style={{ marginLeft: '16px', fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em' }}>
            ManageX ERP
          </span>
        </div>

        <Title style={{ color: '#fff', fontSize: '42px', fontWeight: 850, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.05em' }}>
          Manage your business with <span style={{ color: '#a5b4fc' }}>confidence.</span>
        </Title>
        
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', display: 'block', marginBottom: '48px', maxWidth: '400px', fontWeight: 500 }}>
          Everything you need to run and scale your operations in one simple, powerful platform.
        </Text>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {[
            { title: 'Secure & Scalable', desc: 'Enterprise-grade security for your data.' },
            { title: 'Real-time Insights', desc: 'Make decisions based on live business metrics.' },
            { title: 'Multi-language Support', desc: 'Work in the language your team understands.' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', flexShrink: 0 }}>✓</div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>{item.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </Space>
      </div>

      <div style={{ position: 'absolute', bottom: '40px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500 }}>
        © 2026 ManageX ERP. All rights reserved.
      </div>
    </Content>
  );
}
