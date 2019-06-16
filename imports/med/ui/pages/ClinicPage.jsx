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

function getClinic() {
  return Clinic.findOne(Meteor.user().clinic.id);
}

const ClinicPage = ({ clinic, onChange }) => {
  return (
    <Card>
      <AstronomyAutoForm
        labelCol={{ span: 4 }}
        value={clinic}
        type={Clinic}
        onSubmit={onChange}
      >
        <Button
          type="primary"
          htmlType="submit"
        >
          Сохранить
        </Button>
      </AstronomyAutoForm>
    </Card>
  );
};

export default withSubscription('clinic', () => ({
  clinic: getClinic(),
  onChange: data => {
    const clinic = getClinic();
    clinic.set(data);
    meteorCall('clinic.save', clinic)
      .then(message.success('Сохранено'));
  },
}))(ClinicPage);
