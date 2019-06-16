/**
 * Created by kriz on 13/01/16.
 */
import { Migrations } from 'meteor/percolate:migrations';
import addAllPartners from '../fixtures/add-all-partners';

// see https://github.com/percolatestudio/meteor-migrations for details
Migrations.add({
  version: 2,
  name: 'Add first regional partners',
  up() {
    addAllPartners();
  },
  down() {},
});
