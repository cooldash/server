import { secureMethods, securePublish } from '../../server/secure-methods';
import { Clinic, MedService } from './model';
import { User } from '../../utils/user.model';

securePublish({
  clinic: {
    permission: 'clinic.r',
    check: [],
    publish() {
      const user = this.user();
      return Clinic.find(user.clinic.id);
    },
  },
  'clinic.services': {
    permission: 'clinic.r',
    check: [],
    publish() {
      const user = this.user();
      return MedService.find({ clinicId: user.clinic.id });
    },
  },
});

secureMethods({
  'admin.makeClinic': {
    permission: 'admin.makeClinic',
    check: [String],
    method(userId) {
      const clinic = new Clinic();
      clinic.save();

      const user = User.findOne(userId);
      user.roles.push('clinicAdmin');
      user.clinic.id = clinic._id;
      user.save();
    },
  },

  'clinic.save': {
    permission: 'clinic.w',
    check: [Clinic],
    method(clinic) {
      clinic.save();
    },
  },
});
