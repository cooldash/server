import Roles from '../../mods/roles/index';

export const withPermission = (permission) => Component =>
  (props) => {
    Roles.checkThrow(permission);
    return <Component {...props} />
  };
