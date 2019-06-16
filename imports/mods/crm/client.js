import { each } from 'lodash';
import { types } from '../tree/base/type-db';
import { getComponent } from '../tree';

export const crmTypes = [];

export const initCrm = () => {
  console.log(types);
  each(types, Type => {
    const component = getComponent(Type, ['server', 'crm']);
    if (component)
      crmTypes.push({ type: Type, component });
  });
};
