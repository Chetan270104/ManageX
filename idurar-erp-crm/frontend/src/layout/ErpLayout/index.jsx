import { ErpContextProvider } from '@/context/erp';

import { Layout } from 'antd';
import { useSelector } from 'react-redux';

const { Content } = Layout;

export default function ErpLayout({ children }) {
  return (
    <ErpContextProvider>
      <Content
        style={{
          margin: '40px auto',
          width: '100%',
          maxWidth: '1280px',
          minHeight: '600px',
          padding: '0 40px',
        }}
      >
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '24px', 
          border: '1px solid #f1f5f9',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          padding: '32px'
        }}>
          {children}
        </div>
      </Content>
    </ErpContextProvider>
  );
}
