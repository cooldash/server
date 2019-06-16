// additional Match utils

import { Match } from 'meteor/check';

Match.NotNull = Match.Where(c => !!c);
