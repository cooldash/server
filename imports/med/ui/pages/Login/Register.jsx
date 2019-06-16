import React from 'react';
import { Layout, Card } from 'antd';
import { RegisterComponent } from '../../components/User/Register';

export default (props) => (
  <Layout style={{ height: '100%' }}>
    <Card style={{ width: 400, margin: 'auto', marginTop: 100 }}>
      <RegisterComponent {...props} />
    </Card>
  </Layout>
)
