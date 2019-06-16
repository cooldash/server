/**
 * Created by kriz on 13/01/16.
 */

import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import * as log from '../../utils/log';

// import './002-add-partners';
// import './003-order-to-cart';
// import './004-address-to-point';

const logger = opts => {
  log[opts.level](opts.tag, opts.message);
};

export default function () {
  // see https://github.com/percolatestudio/meteor-migrations for details
  Migrations.config({
    // Log job run details to console
    log: true,
    // Use a custom logger function (defaults to Meteor's logging package)
    logger,
    // Enable/disable logging "Not migrating, already at version {number}"
    logIfLatest: true,
    // migrations collection name to use in the database
    collectionName: 'migrations',
  });

  Meteor.startup(() => Migrations.migrateTo('latest'));
}
