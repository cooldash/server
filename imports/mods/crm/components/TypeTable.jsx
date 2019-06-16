import React from 'react';
import { Button, Divider, Form, Table } from 'antd';
import { get, map } from 'lodash';
import dayjs from 'dayjs';
import memoize from 'lodash/memoize';
import { t, Trans } from '@lingui/macro';
import { T } from '../../../i18n';

import ConfirmButton from '../../../ui/components/ConfirmButton';
import { AstronomyAutoForm } from '../../form/AstronomyForm';
import { addComponent, getComponent } from '../../tree';
import RenderMeta from '../../tree/ui/render-meta';

function findPath(pathArr, start, resolver) {
  return pathArr.reduce(resolver, start);
}

function resolveField(Type, path) {
  return findPath(path.split('.'), { type: { class: Type } }, (cur, name) => {
    if (!Number.isNaN(+name)) {
      return cur;
    }

    if (!cur.type.class.getField) {
      console.error('cant get field, no getField', name);
      return null;
    }

    const field = cur.type.class.getField(name);
    if (!field) {
      console.warn('cant get field', name);
      return { name };
    }
    return { ...field, name: path };
  });
}

export default class TypeTable extends React.Component {
  state = {
    creating: false,
  };

  toggleCreate = () => {
    this.setState(({ creating }) => ({ creating: !creating }));
  };

  onUpdate = (meta, data) => {
    meta.set(data);
    this.props.meta.update(meta)
      .then(() => meta._isNew && this.toggleCreate());
  };

  onRemove = record => {
    this.props.meta.remove(record._id);
  };

  getColumns = () => {
    const { fields, meta: { type: Type } } = this.props;

    const typeFields = fields ? map(fields, (opts, name) => resolveField(Type, name)) : Type.getFields();
    return typeFields.map(field => {
      const resolve = get(fields, [field.name, 'resolve'], x => x);
      const render = get(fields, [field.name, 'render']);
      return ({
        title: T(field.name),
        dataIndex: field.name,
        render: (value, record) => (render
            ? render(value, record)
            : this.renderCell(field, resolve(value, record))
        ),
      });
    });
  };

  renderForm = (data, onSubmit, buttons) => {
    const { meta: { type }, fields } = this.props;
    return (
      <RenderMeta
        context="react edit"
        value={data}
        onChange={values => onSubmit(data, values)}
        fields={fields}
        defaultRender={() => (
          <AstronomyAutoForm
            type={type}
            onSubmit={values => onSubmit(data, values)}
            value={data}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            fields={fields}
          >
            {buttons}
          </AstronomyAutoForm>
        )}
      />
    );
  };

  getComponent = memoize(getComponent);
  renderCell = (field, record) => {
    const Component = this.getComponent(field.type.class, ['react', 'cell']);
    // console.dir(field.type.class);
    return <Component value={record} field={field} />;
  };

  render() {
    const { meta: { type: Type, downloadExcel }, values, details: Details } = this.props;
    const { creating } = this.state;
    const columns = this.getColumns();

    return (<>
      <Table
        columns={columns}
        dataSource={values}
        scroll={{ x: true }}
        expandedRowRender={record => (<>
          {Details && <Details value={record} />}
          {this.renderForm(record, this.onUpdate, (<>
            <Form.Item style={{ display: 'inline-block', marginRight: 64 }}>
              <Button type="primary" htmlType="submit"><Trans>Update</Trans></Button>
            </Form.Item>
            <Form.Item style={{ display: 'inline-block' }}>
              <ConfirmButton
                title={T(t`remove.confirm.question`)}
                onClick={() => this.onRemove(record)}
              >
                <Trans>Remove</Trans>
              </ConfirmButton>
            </Form.Item>
          </>))}
        </>)}
        expandRowByClick
        rowKey="_id"
      />

      {creating && this.renderForm(new Type(), this.onUpdate, (
        <Form.Item>
          <Button type="primary" htmlType="submit"><Trans>Create</Trans></Button>
        </Form.Item>
      ))}
      <Form.Item>
        <Button type={creating ? 'danger' : 'primary'} onClick={this.toggleCreate}>
          {T(creating ? t`Cancel` : t`Create`)}
        </Button>
      </Form.Item>
      <Divider />
      <Button onClick={() => downloadExcel()}><Trans id="excel.download" /></Button>
    </>);
  }
}

addComponent(({ value }) => `${value}`, 'default', 'react cell');
addComponent(({ value }) => `${value}`, String, 'react cell');
addComponent(({ value }) => `${value}`, Boolean, 'react cell');
addComponent(({ value }) => JSON.stringify(value), Object, 'react cell');
addComponent(({ value }) => dayjs(value).format('DD.MM.YYYY HH:mm:ss'), Date, 'react cell');
