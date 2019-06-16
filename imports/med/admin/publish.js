import { secureMethods, securePublish } from '../../server/secure-methods';
import { User } from '../../utils/user.model';
import { Clinic } from '../clinic/model';

securePublish({
  'users.new': {
    permission: 'users.r',
    check: [],
    publish() {
      return User.findNew();
    },
  },
});
