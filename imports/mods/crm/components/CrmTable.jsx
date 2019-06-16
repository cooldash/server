import React from 'react';
import { Spin } from 'antd';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { compose } from 'recompose';

import withTracker from '../../../ui/utils/withTracker';
import renderMeta from '../../tree/ui/render-meta';
import { getType, Class } from '../../tree';
import meteorCall from '../../../utils/meteor-async-call';
import { withGetExcel } from '../../../ui/utils/withGetExcel';

class CrmTable extends React.Component {
  render() {
    const { values, ...rest } = this.props;
    return renderMeta({ type: rest.type, value: rest, values, context: 'react crm' });
  }
}

const loadCrm = (props, onData) => {
  const { typeName } = props.params;
  check(typeName, String);
  const type = getType(typeName);
  check(Class.isPrototypeOf(type), true);

  const sub = Meteor.subscribe(`crm.${typeName}`);
  if (sub.ready()) {
    function update(meta) {
      return meteorCall(`crm.${typeName}.update`, meta);
    }
    function remove(id) {
      return meteorCall(`crm.${typeName}.remove`, id);
    }

    onData({
      update,
      remove,
      values: type.find().fetch(),
      type,
    });
  }
};

export default compose(
  withTracker(loadCrm, {
    loadingHandler: () => (<Spin />),
  }),
  withGetExcel(({ params: { typeName } }) => ({ publish: `crm.${typeName}`, name: `${typeName}.xlsx` })),
)(CrmTable);
