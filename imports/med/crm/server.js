import { addComponent, getTypeName } from '../../mods/tree';
import { crmTypes } from './common';
import { CrmPublish } from '../../mods/crm/server';
import { addRoles } from '../../mods/roles';

crmTypes.forEach(({ type }) => {
  addComponent(CrmPublish, type, 'server crm');
  const typeName = getTypeName(type);

  addRoles({
    admin: {
      [`crm.${typeName}.r`]: true,
      [`crm.${typeName}.w`]: true,
    },
  })
});
