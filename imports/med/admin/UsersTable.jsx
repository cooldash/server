/**
 * Created by kriz on 15/06/2019.
 */

import React from 'react';
import { User } from '../../utils/user.model';

import withTracker from '../../ui/utils/withTracker';
import { withSubscription } from '../../ui/utils/withSubscription';
import Roles from '../../mods/roles';
import { Payment } from '../../imperial/payments/model';
import InfoTable from '../../ui/components/InfoTable';

import styles from './styles.module.less';
import { Button } from 'antd';
import meteorCall from '../../utils/meteor-async-call';


const columnsInfo = {
  _id: { className: styles.idCol },
  createdAt: { className: styles.dateCol },
  // city: ,
  email: (id, { emails }) => emails[0].address,
};

class UsersTable extends React.Component {
  renderUser = user => {
    return (
      <Button onClick={() => this.props.makeClinic(user._id)} type="primary">
        Сделать администратором клиники
      </Button>
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
    const { newUsers } = this.props;

    return (
      <>
        <InfoTable
          type={Payment}
          columnsInfo={columnsInfo}
          dataSource={newUsers}
          expandedRowRender={this.renderUser}
          rowKey="_id"
          props={this.props}
        />
        {/*<Button onClick={() => downloadExcel()}><Trans id="excel.download">Скачать Excel Файл</Trans></Button>*/}
      </>
    );
  }
}

export default withSubscription('users.new', () => ({
  makeClinic: userId => meteorCall('admin.makeClinic', userId),
  newUsers: User.findNew().fetch(),
}))(UsersTable);
