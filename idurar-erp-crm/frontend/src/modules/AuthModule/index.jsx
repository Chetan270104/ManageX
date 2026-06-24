import useLanguage from '@/locale/useLanguage';

import { Layout, Col, Divider, Typography } from 'antd';

import AuthLayout from '@/layout/AuthLayout';
import SideContent from './SideContent';

import logo from '@/style/images/idurar-crm-erp.svg';

const { Content } = Layout;
const { Title } = Typography;

const AuthModule = ({ authContent, AUTH_TITLE, isForRegistre = false }) => {
  const translate = useLanguage();
  return (
    <AuthLayout sideContent={<SideContent />}>
      <Content
        style={{
          padding: isForRegistre ? '40px' : '0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100vh',
          maxWidth: '500px',
          margin: '0 auto',
        }}
      >
        <div style={{ padding: '0 40px' }} className="animate-fade-in">
          <div style={{ marginBottom: '40px' }}>
            <Title style={{ fontSize: '32px', fontWeight: 850, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.025em' }}>
              {translate(AUTH_TITLE)}
            </Title>
            <p style={{ color: '#64748b', fontSize: '16px', fontWeight: 500 }}>
              Please enter your details to continue.
            </p>
          </div>
          
          <div className="site-layout-content" style={{ background: 'transparent' }}>
            {authContent}
          </div>
        </div>
      </Content>
    </AuthLayout>
  );
};

export default AuthModule;
