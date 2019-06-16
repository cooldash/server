/**
 * Created by kriz on 16/06/2019.
 */

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Card, message } from 'antd';

import { AstronomyAutoForm } from '../../../mods/form/AstronomyForm';
import { Clinic } from '../../clinic/model';
import { withSubscription } from '../../../ui/utils/withSubscription';
import meteorCall from '../../../utils/meteor-async-call';
import ServicesTable from '../../admin/ServicesTable';

const ServicesPage = ({ }) => {
  return (
    <Card>
      <ServicesTable />
    </Card>
  );
};

export default ServicesPage;

// export default withSubscription('clinic', () => ({
//   clinic: getClinic(),
//   onChange: data => {
//     const clinic = getClinic();
//     clinic.set(data);
//     meteorCall('clinic.save', clinic)
//       .then(message.success('Сохранено'));
//   },
// }))(ClinicPage);
