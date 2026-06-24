import { useState, useEffect } from 'react';
import { Divider } from 'antd';

import { Button, Row, Col, Descriptions, Statistic, Tag } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import {
  EditOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  RetweetOutlined,
  MailOutlined,
} from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';

import { generate as uniqueId } from 'shortid';

import { selectCurrentItem } from '@/redux/erp/selectors';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { useMoney, useDate } from '@/settings';
import useMail from '@/hooks/useMail';
import { useNavigate } from 'react-router-dom';

const Item = ({ item, currentErp }) => {
  const { moneyFormatter } = useMoney();
  return (
    <Row gutter={[12, 12]} key={item._id} style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
      <Col className="gutter-row" span={11}>
        <p style={{ marginBottom: 4, color: '#0f172a', fontWeight: 600 }}>
          {item.itemName}
        </p>
        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>{item.description}</p>
      </Col>
      <Col className="gutter-row" span={4}>
        <p style={{ textAlign: 'right', margin: 0, color: '#334155' }}>
          {moneyFormatter({ amount: item.price, currency_code: currentErp.currency })}
        </p>
      </Col>
      <Col className="gutter-row" span={4}>
        <p style={{ textAlign: 'right', margin: 0, color: '#334155' }}>
          {item.quantity}
        </p>
      </Col>
      <Col className="gutter-row" span={5}>
        <p style={{ textAlign: 'right', margin: 0, fontWeight: '700', color: '#0f172a' }}>
          {moneyFormatter({ amount: item.total, currency_code: currentErp.currency })}
        </p>
      </Col>
    </Row>
  );
};

export default function ReadItem({ config, selectedItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { moneyFormatter } = useMoney();
  const { send, isLoading: mailInProgress } = useMail({ entity });

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

  const [itemslist, setItemsList] = useState([]);
  const [currentErp, setCurrentErp] = useState(selectedItem ?? resetErp);
  const [client, setClient] = useState({});

  useEffect(() => {
    if (currentResult) {
      const { items, invoice, ...others } = currentResult;

      if (items) {
        setItemsList(items);
        setCurrentErp(currentResult);
      } else if (invoice.items) {
        setItemsList(invoice.items);
        setCurrentErp({ ...invoice.items, ...others, ...invoice });
      }
    }
    return () => {
      setItemsList([]);
      setCurrentErp(resetErp);
    };
  }, [currentResult]);

  useEffect(() => {
    if (currentErp?.client) {
      setClient(currentErp.client);
    }
  }, [currentErp]);

  return (
    <>
      <PageHeader
        onBack={() => navigate(-1)}
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
            onClick={() => navigate(`/${entity.toLowerCase()}`)}
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
              dispatch(erp.convert({ entity, id: currentErp._id }));
            }}
            icon={<RetweetOutlined />}
            style={{ display: entity === 'quote' ? 'inline-block' : 'none', borderRadius: '10px', fontWeight: 600 }}
          >
            {translate('Convert')}
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
                title={translate('Status')} 
                value={currentErp.status} 
                valueStyle={{ color: '#4f46e5', fontWeight: 800, fontSize: '20px', textTransform: 'capitalize' }}
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
            <Col xs={24} sm={6}>
              <Statistic
                title={translate('Paid')}
                value={moneyFormatter({
                  amount: currentErp.credit,
                  currency_code: currentErp.currency,
                })}
                valueStyle={{ color: '#10b981', fontWeight: 800, fontSize: '20px' }}
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
                  {translate('Bill To')}
                </h3>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: '0 0 8px 0' }}>{client.name}</p>
                <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>{client.email}</p>
                <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>{client.phone}</p>
                <p style={{ color: '#64748b', margin: '0', maxWidth: '300px' }}>{client.address}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {translate('Details')}
                </h3>
                <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Date: <span style={{ color: '#1e293b', fontWeight: 600 }}>{currentErp.date ? new Date(currentErp.date).toLocaleDateString() : '-'}</span></p>
                <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Due Date: <span style={{ color: '#1e293b', fontWeight: 600 }}>{currentErp.expiredDate ? new Date(currentErp.expiredDate).toLocaleDateString() : '-'}</span></p>
              </div>
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: '24px' }}>
          <Row gutter={[12, 0]} style={{ padding: '12px 0', borderBottom: '2px solid #0f172a' }}>
            <Col span={11}>
              <Text strong style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em', color: '#0f172a' }}>{translate('Item Description')}</Text>
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <Text strong style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em', color: '#0f172a' }}>{translate('Price')}</Text>
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <Text strong style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em', color: '#0f172a' }}>{translate('Qty')}</Text>
            </Col>
            <Col span={5} style={{ textAlign: 'right' }}>
              <Text strong style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em', color: '#0f172a' }}>{translate('Total')}</Text>
            </Col>
          </Row>
          
          <div style={{ marginBottom: '40px' }}>
            {itemslist.map((item) => (
              <Item key={item._id} item={item} currentErp={currentErp}></Item>
            ))}
          </div>

          <Row justify="end">
            <Col span={8}>
              <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <Text style={{ color: '#64748b', fontWeight: 500 }}>{translate('Sub Total')}</Text>
                  <Text strong style={{ color: '#1e293b' }}>
                    {moneyFormatter({ amount: currentErp.subTotal, currency_code: currentErp.currency })}
                  </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <Text style={{ color: '#64748b', fontWeight: 500 }}>{translate('Tax')} ({currentErp.taxRate}%)</Text>
                  <Text strong style={{ color: '#1e293b' }}>
                    {moneyFormatter({ amount: currentErp.taxTotal, currency_code: currentErp.currency })}
                  </Text>
                </div>
                <Divider style={{ margin: '16px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{translate('Total')}</Text>
                  <Text style={{ fontSize: '22px', fontWeight: 900, color: '#4f46e5' }}>
                    {moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency })}
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
