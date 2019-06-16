import React from 'react';

import i18n from 'meteor/universe:i18n';
import {
  Card,
  Button,
  Form,
  Icon,
  Input,
  Row, Col,
  Checkbox,
  Spin,
} from 'antd';

import BaseComponent from './BaseComponent.jsx';

export const makeField = (form, opt = {}) => (
  {
    field,
    label,
    message,
    type = "text",
    placeholder=(label || field),
    icon,
    disabled,
    required = true,
    input,
    decorator,
    labelCol,
    wrapperCol,
    colon = false,
    ...props,
  }
) => (
  <Form.Item
    label={label}
    colon={colon}
    labelCol={opt.labelCol || labelCol}
    wrapperCol={opt.wrapperCol || wrapperCol}
  >
    {decorator || form.getFieldDecorator(field, {
      rules: [{ required: !disabled && required, message }],
    })(input ||
      <Input
        prefix={icon && <Icon type={icon} style={{ color: 'rgba(0,0,0,.25)' }} />}
        type={type}
        placeholder={placeholder}
        size="default"
        disabled={disabled}
        {...props}
      />
    )}
  </Form.Item>
);

export default makeField;
