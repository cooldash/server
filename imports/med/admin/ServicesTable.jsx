/**
 * Created by kriz on 15/06/2019.
 */

import React from 'react';
import { Button, Input, List, Form, Icon, Row, Col } from 'antd';

import { User } from '../../utils/user.model';
import { MedService } from '../clinic/model';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import meteorCall from '../../utils/meteor-async-call';
import withTracker from '../../ui/utils/withTracker';
import { withSubscription } from '../../ui/utils/withSubscription';
import Roles from '../../mods/roles';
import { Payment } from '../../imperial/payments/model';
import InfoTable from '../../ui/components/InfoTable';

import styles from './styles.module.less';

const SortableItem = SortableElement(({ value }) => <List.Item>{value}</List.Item>);

const SortableList = SortableContainer(({ items }) => (
  <List
    dataSource={items}
    renderItem={(item, index) => (
      <SortableItem key={`item-${index}`} index={index} value={item} />
    )}
  />
));


const ExtraList = ({ extra }) => {
  return (
    <SortableList
      items={extra}
    />
  );
};

const columnsInfo = {
  // _id: { className: styles.idCol },
  name: { className: styles.dateCol },
  // city: ,
};

class UsersTable extends React.Component {
  renderService = ({ extra }) => {
    return (
      <ExtraList
        extra={[
          (<Row style={{ width: '100%' }}>
            <Col span={1}>
              <Icon style={{ fontSize: 24 }} type="more" />
            </Col>
            <Col span={18}>
              <Form.Item labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="Название характеристики">
                <Input value="Тип анализов" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>),
          (<Row style={{ width: '100%' }}>
            <Col span={1}>
              <Icon style={{ fontSize: 24 }} type="more" />
            </Col>
            <Col span={18}>
              <Form.Item labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="Название характеристики" style={{ width: '100%' }}>
                <Input value="Назначение анализа" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>),
        ]}
      />
    );
  };
  // renderPayment = order => {
  //   const Details = this.props.detailsComponent;
  //   return (<>
  //     <p><b><Trans id="comment" />:</b> {order.comment}</p>
  //     <PartnerCard partnerID={order.partnerID} loadLegalEntity={Roles.hasPermission('payments.account')} />
  //     {Details && <div className={styles.details}><Details payment={order} /></div>}
  //   </>);
  // };

  render() {
    // const { services } = this.props;

    const services = [
      {
        name: 'Рентген',
      },
      {
        name: 'Анализы',
      },
      {
        name: 'Офтальмолог',
      },
    ];

    return (
      <>
        <InfoTable
          type={Payment}
          columnsInfo={columnsInfo}
          dataSource={services}
          expandedRowRender={this.renderService}
          rowKey="_id"
          props={this.props}
        />

        {/*<Button onClick={() => downloadExcel()}><Trans id="excel.download">Скачать Excel Файл</Trans></Button>*/}
      </>
    );
  }
}

export default withSubscription('clinic.services', () => ({
  saveService: userId => meteorCall('admin.makeClinic', userId),
  services: MedService.find().fetch(),
}))(UsersTable);
