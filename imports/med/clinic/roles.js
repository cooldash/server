import { addPermissions, addRoles } from '../../mods/roles';

addPermissions([
  'clinic.r',
  'clinic.w',
]);

addRoles({
  clinicAdmin: {
    'clinic.r': true,
    'clinic.w': true,
  },
});
