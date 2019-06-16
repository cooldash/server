import { addPermissions, addRoles } from '../../mods/roles';

addPermissions([
  'loggedIn',
]);
addRoles({
  __loggedIn__: {
    loggedIn: true,
  },
});
