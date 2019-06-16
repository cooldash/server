/**
 * Created by kriz on 23/02/2019.
 */

import React, { useMemo } from 'react';
import { Table } from 'antd';
import { get, identity, map, memoize } from 'lodash';

import { T } from '../../../i18n';
import { addComponent, getComponent } from '../../../mods/tree';
import { getField } from '../../utils/getField';

// if no field specified - render as resolved
export class Raw {}
addComponent(({ value }) => (value), Raw, 'react cell');

const InfoTable = ({ columnsInfo, dataSource, type, props, ...rest }) => {
  const columns = useMemo(() => {
    const memoizedGetComponent = memoize(getComponent);
    const renderCell = (field, record) => {
      const Component = memoizedGetComponent(field.type.class, ['react', 'cell']);
      if (!Component) {
        return null;
      }
      return <Component value={record} field={field} />;
    };

    return map(columnsInfo, (info, fieldName) => {
      if (info === true) {
        info = {};
      } else if (typeof info === 'function') {
        info = { resolve: info };
      }
      const { resolve = identity, ...restInfo } = info;

      const field = getField(type, fieldName) || { name: fieldName, type: { class: Raw } };
      return {
        title: T(get(field, 'form.label', field.name)),
        dataIndex: fieldName,
        render: (value, record) => renderCell(field, resolve(value, record, props)),
        ...restInfo,
      };
    });
  }, [columnsInfo]);

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      expandRowByClick
      pagination={dataSource.length > 10}
      {...rest}
    />
  );
};

export default InfoTable;
