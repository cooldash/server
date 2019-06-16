/**
 * Created by kriz on 05/04/2019.
 */

import React from 'react';
import { Button, Popconfirm } from 'antd';

import { t } from '@lingui/macro';
import { T } from '../../i18n';

const ConfirmButton = ({ title, onClick, children, type = 'danger', className, cancelText }) => (
  <Popconfirm
    title={title}
    cancelText={cancelText || T(t`Cancel`)}
    okText={children}
    onConfirm={onClick}
  >
    <Button type={type} className={className}>{children}</Button>
  </Popconfirm>
);

export default ConfirmButton;
