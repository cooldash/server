import React, { useMemo } from 'react';
import { Form, Button } from 'antd';
import { Trans } from '@lingui/macro';

import { AstronomyAutoForm } from '../../mods/form/AstronomyForm';

export const VerticalForm = ({ value, fields, onChange }) => {
  const type = useMemo(() => value.constructor, []);
  return (
    <AstronomyAutoForm
      layout="vertical"
      value={value}
      onSubmit={onChange}
      labelCol={{}}
      wrapperCol={{}}
      type={type}
      fields={fields}
    >
      <Form.Item>
        <Button type="primary" htmlType="submit"><Trans id="save" /></Button>
      </Form.Item>
    </AstronomyAutoForm>
  );
};
