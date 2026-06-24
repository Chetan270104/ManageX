import { useState, useEffect } from 'react';

import { Button, Row, Col, Descriptions, Statistic, Tag, Divider, Typography } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import {
  EditOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  MailOutlined,
  ExportOutlined,
} from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';

import { generate as uniqueId } from 'shortid';

import { selectCurrentItem } from '@/redux/erp/selectors';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { useMoney } from '@/settings';

import useMail from '@/hooks/useMail';
import { useNavigate } from 'react-router-dom';

export default function ReadItem({ config, selectedItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();

  const { moneyFormatter } = useMoney();
  const { send, isLoading: mailInProgress } = useMail({ entity });
  const navigate = useNavigate();

  const { result: currentResult } = useSelector(selectCurrentItem);

  const resetErp = {
    status: '',
    client: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    subTotal: 0,
    taxTotal: 0,
    taxRate: 0,
    total: 0,
    credit: 0,
    number: 0,
    year: 0,
  };

  const [currentErp, setCurrentErp] = useState(selectedItem ?? resetErp);
  const [client, setClient] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    if (currentResult) {
      const { invoice, _id, ...others } = currentResult;
      setCurrentErp({ ...others, ...invoice, _id });
    }
    return () => controller.abort();
  }, [currentResult]);

  useEffect(() => {
    if (currentErp?.client) {
      setClient(currentErp.client);
    }
  }, [currentErp]);

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{ENTITY_NAME}</span>
            <Tag color="blue" style={{ borderRadius: '6px', fontWeight: 600 }}>#{currentErp.number}/{currentErp.year || ''}</Tag>
          </div>
        }
        ghost={false}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
            style={{ borderRadius: '10px', fontWeight: 600 }}
          >
            {translate('Close')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              window.open(
                `${DOWNLOAD_BASE_URL}${entity}/${entity}-${currentErp._id}.pdf`,
                '_blank'
              );
            }}
            icon={<FilePdfOutlined />}
            style={{ borderRadius: '10px', fontWeight: 600 }}
          >
            {translate('PDF')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            loading={mailInProgress}
            onClick={() => {
              send(currentErp._id);
            }}
            icon={<MailOutlined />}
            style={{ borderRadius: '10px', fontWeight: 600 }}
          >
            {translate('Email')}
          </Button>,

          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              dispatch(
                erp.currentAction({
                  actionType: 'update',
                  data: currentErp,
                })
              );
              navigate(`/${entity.toLowerCase()}/update/${currentErp._id}`);
            }}
            type="primary"
            icon={<EditOutlined />}
            style={{ borderRadius: '10px', fontWeight: 600 }}
          >
            {translate('Edit')}
          </Button>,
        ]}
        style={{
          padding: '24px 0',
          background: 'transparent',
          marginBottom: '32px'
        }}
      >
        <div style={{ 
          background: '#f8fafc', 
          padding: '24px', 
          borderRadius: '20px', 
          border: '1px solid #f1f5f9',
          marginBottom: '32px'
        }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={6}>
              <Statistic 
                title="Status" 
                value={currentErp.status} 
                valueStyle={{ color: '#4f46e5', fontWeight: 800, fontSize: '20px', textTransform: 'capitalize' }}
              />
            </Col>
            <Col xs={24} sm={6}>
              <Statistic
                title={translate('Paid')}
                value={moneyFormatter({
                  amount: currentErp.amount,
                  currency_code: currentErp.currency,
                })}
                valueStyle={{ color: '#10b981', fontWeight: 800, fontSize: '20px' }}
              />
            </Col>
            <Col xs={24} sm={6}>
              <Statistic
                title={translate('SubTotal')}
                value={moneyFormatter({
                  amount: currentErp.subTotal,
                  currency_code: currentErp.currency,
                })}
                valueStyle={{ fontWeight: 700, fontSize: '20px' }}
              />
            </Col>
            <Col xs={24} sm={6}>
              <Statistic
                title={translate('Total')}
                value={moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency })}
                valueStyle={{ color: '#0f172a', fontWeight: 850, fontSize: '24px' }}
              />
            </Col>
          </Row>
        </div>
      </PageHeader>

      <div style={{ padding: '0 12px' }}>
        <Row gutter={[48, 48]}>
          <Col span={24}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {translate('Client Information')}
                </h3>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: '0 0 8px 0' }}>{client.name}</p>
                <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>{client.email}</p>
                <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>{client.phone}</p>
                <p style={{ color: '#64748b', margin: '0', maxWidth: '300px' }}>{client.address}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {translate('Payment Details')}
                </h3>
                <Button 
                  icon={<ExportOutlined />} 
                  onClick={() => navigate(`/invoice/read/${currentErp.invoice?._id}`)}
                  style={{ borderRadius: '10px', fontWeight: 600, marginBottom: '16px' }}
                >
                  {translate('Show invoice')}
                </Button>
                <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Date: <span style={{ color: '#1e293b', fontWeight: 600 }}>{currentErp.date ? new Date(currentErp.date).toLocaleDateString() : '-'}</span></p>
                <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Mode: <span style={{ color: '#1e293b', fontWeight: 600 }}>{currentErp.paymentMode?.name || '-'}</span></p>
              </div>
            </div>
          </Col>
        </Row>

        <Divider />

        <Row justify="start">
          <Col span={8}>
            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <Text style={{ color: '#64748b', fontWeight: 500 }}>{translate('Amount Paid')}</Text>
                <Text strong style={{ color: '#10b981', fontSize: '16px' }}>
                  {moneyFormatter({ amount: currentErp.amount, currency_code: currentErp.currency })}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <Text style={{ color: '#64748b', fontWeight: 500 }}>{translate('Total Amount')}</Text>
                <Text strong style={{ color: '#1e293b' }}>
                  {moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency })}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <Text style={{ color: '#64748b', fontWeight: 500 }}>{translate('Total Credit')}</Text>
                <Text strong style={{ color: '#1e293b' }}>
                  {moneyFormatter({ amount: currentErp.credit, currency_code: currentErp.currency })}
                </Text>
              </div>
              <Divider style={{ margin: '16px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{translate('Remaining Balance')}</Text>
                <Text style={{ fontSize: '18px', fontWeight: 900, color: '#ef4444' }}>
                  {moneyFormatter({
                    amount: currentErp.total - currentErp.credit,
                    currency_code: currentErp.currency,
                  })}
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
