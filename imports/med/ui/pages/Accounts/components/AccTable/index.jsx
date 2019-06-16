import React from 'react';
import moment from 'moment';
import { Table } from 'antd';
import styles from './index.module.less';
import { t } from '../../../../../../../i18n';

export default function AccTable({ orders }) {
  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      width: 100,
      render: id => id.substr(0, 8).toLowerCase(),
    },
    {
      title: 'Дата',
      dataIndex: 'time',
      width: 100,
      render: time => moment(time).format('DD-MM HH:mm:ss'),
    },
    // {
    //   title: 'Биржа',
    //   dataIndex: 'exchange',
    //   width: 100,
    // },
    {
      title: 'Пара',
      dataIndex: 'symbol',
      width: 100,
    },
    {
      title: 'Операция',
      dataIndex: 'orders.0.type',
      width: 100,
      render: type => t(`imperial.type.${type}`)
    },
    {
      title: 'Объем',
      dataIndex: 'orders.0.v',
      width: 100,
      render: v => v ? v : t('imperial.order_not_run'),
    },
    // {
    //   title: 'Сумма прибыли',
    //   dataIndex: 'profit',
    //   width: 100,
    // },
    // {
    //   title: 'Прибыль',
    //   dataIndex: 'relativeprofit',
    //   width: 100,
    // },
  ];

  return (
    <Table
      className={styles.table}
      rowClassName={styles.tablerow}
      columns={columns}
      dataSource={orders}
      pagination={false}
      scroll={{ y: 240 }}
      rowKey="_id"
    />
  );
}
