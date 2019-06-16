/**
 * Created by kriz on 04/03/17.
 */

import differenceBy from 'lodash/differenceBy';
import { info } from '../../utils/log';
import { Node } from '../base/node';
import { NamedNode } from '../../mods/types/named-node/NamedNode.meta';

export default function initAutostart(serviceManager) {
  const withAuthstart = doc => doc.meta().filter(meta => meta.hasTag('autostart'));
  const startAll = arr => Promise.all(arr.map(meta =>
    serviceManager.startService(meta),
  ));
  const stopAll = arr => arr.forEach(meta => {
    serviceManager.stopService(meta);
  });


  info('Autostart count:', NamedNode.find({ '_m._tg': 'autostart' }).count());

  Node.find({ '_m._tg': 'autostart', _t: undefined })
    .observe({
      added(doc) {
        info('autostart', 'added', doc._id);

        startAll(withAuthstart(doc));
      },
      changed(doc, oldItem) {
        info('autostart', 'changed', doc._id);

        const newAuto = withAuthstart(doc);
        const oldAuto = withAuthstart(oldItem);

        const toStart = differenceBy(newAuto, oldAuto, m => m._id);
        const toStop = differenceBy(oldAuto, newAuto, m => m._id);

        stopAll(toStop);
        startAll(toStart);
      },
      removed(before) {
        info('autostart', 'removed', before._id);

        stopAll(withAuthstart(before));
      },
    });
}
