import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function LoginForm() {
  const translate = useLanguage();
  return (
    <div>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your email!',
          },
          {
            type: 'email',
            message: 'Please enter a valid email!',
          },
        ]}
      >
        <Input
          prefix={<UserOutlined style={{ color: '#64748b' }} />}
          placeholder={'Email (admin@admin.com)'}
          size="large"
          style={{ height: '50px' }}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: '#64748b' }} />}
          placeholder={'Password (admin123)'}
          size="large"
          style={{ height: '50px' }}
        />
      </Form.Item>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox style={{ fontWeight: 500, color: '#64748b' }}>{translate('Remember me')}</Checkbox>
        </Form.Item>
        <a 
          className="login-form-forgot" 
          href="/forgetpassword" 
          style={{ fontWeight: 600, color: '#4f46e5' }}
        >
          {translate('Forgot password')}
        </a>
      </div>
    </div>
  );
}
