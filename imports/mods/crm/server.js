import { each } from 'lodash';
import { MongoCounters } from 'meteor/krizka:mongo-counters';

import { typeContexts, types } from '../tree/base/type-db';
import { secureMethods, securePublish } from '../../server/secure-methods';
import { getComponent, getTypeName } from '../tree';

export const CrmPublish = Type => {
  const typeName = getTypeName(Type);
  securePublish({
    [`crm.${typeName}`]: {
      permission: `crm.${typeName}.r`,
      publish() {
        const sort = {};
        if (Type.getField('id')) {
          sort.id = 1;
        } else if (Type.getField('createdAt')) {
          sort.createdAt = 1;
        }

        return Type.find({}, { sort });
      },
    },
  });

  secureMethods({
    [`crm.${typeName}.update`]: {
      permission: `crm.${typeName}.w`,
      method(obj) {
        if (obj._isNew) {
          obj.id = MongoCounters.createCounter(`${typeName}.id`).increment();
        }
        obj.save();
      },
    },
    [`crm.${typeName}.remove`]: {
      permission: `crm.${typeName}.w`,
      method(objId) {
        Type.remove(objId);
      },
    },
  });
};

export const initCrm = () => {
  each(types, Type => {
    const component = getComponent(Type, ['server', 'crm']);
    if (component) {
      component(Type);
    }
  });
};

