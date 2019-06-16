import { addComponent } from '../../mods/tree';
import { crmTypes } from './common';
import TypeTable from '../../mods/crm/components/TypeTable';

crmTypes.forEach(({ type, ...props }) => {
  addComponent(TypeTable, type, 'react crm', { props });
});
