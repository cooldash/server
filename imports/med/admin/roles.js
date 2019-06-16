import { addPermissions, addRoles } from '../../mods/roles';

addPermissions([
  'users.r',
  'admin.makeClinic',
]);

addRoles({
  admin: {
    'users.r': true,
    'admin.makeClinic': true,
  },
});
