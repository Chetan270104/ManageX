import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';

import useLanguage from '@/locale/useLanguage';
import logoIcon from '@/style/images/logo-icon.svg';
import logoText from '@/style/images/logo-text.svg';

import useResponsive from '@/hooks/useResponsive';

import {
  SettingOutlined,
  CustomerServiceOutlined,
  ContainerOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TagOutlined,
  TagsOutlined,
  UserOutlined,
  CreditCardOutlined,
  MenuOutlined,
  FileOutlined,
  ShopOutlined,
  FilterOutlined,
  WalletOutlined,
  ReconciliationOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
}

function Sidebar({ collapsible, isMobile = false }) {
  let location = useLocation();

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const [currentPath, setCurrentPath] = useState(location.pathname.slice(1));

  const translate = useLanguage();
  const navigate = useNavigate();

  const items = [
    {
      key: 'general_group',
      label: <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8c8c8c' }}>{translate('Overview')}</span>,
      type: 'group',
      children: [
        {
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: <Link to={'/'}>{translate('dashboard')}</Link>,
        },
        {
          key: 'customer',
          icon: <CustomerServiceOutlined />,
          label: <Link to={'/customer'}>{translate('customers')}</Link>,
        },
      ]
    },
    {
      key: 'sales_group',
      label: <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8c8c8c' }}>Sales & Billing</span>,
      type: 'group',
      children: [
        {
          key: 'quote',
          icon: <FileSyncOutlined />,
          label: <Link to={'/quote'}>{translate('quote')}</Link>,
        },
        {
          key: 'invoice',
          icon: <ContainerOutlined />,
          label: <Link to={'/invoice'}>{translate('invoices')}</Link>,
        },
      ]
    },
    {
      key: 'financials_group',
      label: <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8c8c8c' }}>Financials</span>,
      type: 'group',
      children: [
        {
          key: 'payment',
          icon: <CreditCardOutlined />,
          label: <Link to={'/payment'}>{translate('payments')}</Link>,
        },
        {
          key: 'paymentMode',
          label: <Link to={'/payment/mode'}>{translate('payments_mode')}</Link>,
          icon: <WalletOutlined />,
        },
        {
          key: 'taxes',
          label: <Link to={'/taxes'}>{translate('taxes')}</Link>,
          icon: <ShopOutlined />,
        },
      ]
    },
    {
      key: 'administration_group',
      label: <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8c8c8c' }}>Administration</span>,
      type: 'group',
      children: [
        {
          key: 'generalSettings',
          label: <Link to={'/settings'}>{translate('settings')}</Link>,
          icon: <SettingOutlined />,
        },
      ]
    }
  ];

  useEffect(() => {
    if (location)
      if (currentPath !== location.pathname) {
        if (location.pathname === '/') {
          setCurrentPath('dashboard');
        } else setCurrentPath(location.pathname.slice(1));
      }
  }, [location, currentPath]);

  useEffect(() => {
    if (isNavMenuClose) {
      setLogoApp(isNavMenuClose);
    }
    const timer = setTimeout(() => {
      if (!isNavMenuClose) {
        setLogoApp(isNavMenuClose);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isNavMenuClose]);
  const onCollapse = () => {
    navMenu.collapse();
  };

  return (
    <Sider
      collapsible={collapsible}
      collapsed={collapsible ? isNavMenuClose : collapsible}
      onCollapse={onCollapse}
      className="navigation"
      width={256}
      style={{
        overflow: 'visible',
        height: '100vh',
        position: isMobile ? 'absolute' : 'sticky',
        top: 0,
        left: 0,
        background: 'transparent',
      }}
      theme={'light'}
    >
      <div
        style={{
          height: 'calc(100vh - 40px)',
          margin: isMobile ? '0' : '20px 0 20px 20px',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          borderRadius: isMobile ? '0' : '12px',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          className="logo"
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: showLogoApp ? 'center' : 'flex-start',
            transition: 'all 0.3s ease'
          }}
        >
          <img src={logoIcon} alt="Logo" style={{ height: '32px', width: 'auto' }} />

          {!showLogoApp && (
            <span
              style={{
                marginLeft: '12px',
                fontSize: '20px',
                fontWeight: 800,
                color: '#1e293b',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.025em',
                background: 'linear-gradient(to right, #4f46e5, #6366f1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              ManageX
            </span>
          )}
        </div>
        <Menu
          items={items}
          mode="inline"
          theme={'light'}
          selectedKeys={[currentPath]}
          style={{
            width: '100%',
            background: 'transparent',
            borderRight: 'none'
          }}
        />
      </div>
    </Sider>
  );
}

function MobileSidebar() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        className="mobile-sidebar-btn"
        style={{ ['marginLeft']: 25 }}
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer
        width={250}
        // style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
        placement={'left'}
        closable={false}
        onClose={onClose}
        open={visible}
      >
        <Sidebar collapsible={false} isMobile={true} />
      </Drawer>
    </>
  );
}
