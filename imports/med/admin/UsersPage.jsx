/**
 * Created by kriz on 15/06/2019.
 */

import React from 'react';
import { Card } from 'antd';
import UsersTable from './UsersTable';


const UsersPage = ({}) => {
  return (
    <Card style={{ marginBottom: 32 }}>
      <UsersTable />
    </Card>
  );
};

export default UsersPage;
