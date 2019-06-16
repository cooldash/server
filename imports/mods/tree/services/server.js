import { Meteor } from 'meteor/meteor';
import initAutostart from './service-autostart';
import ServiceManager from './service-manager';
import portManager from '../ports/port-manager';
import { MetaResolver } from '../base/meta-resolver';
import Link from '../ports/link.type';

export const serviceManager = new ServiceManager(portManager);

const metaResolver = new MetaResolver();
portManager.onResolvePort(link => {
  const meta = metaResolver.resolve(link);
  if (!meta)
    throw new Error(`Meta for socket ${Link.toID(link)} not found`);

  serviceManager.startService(meta);
});

Meteor.startup(() => {
  initAutostart(serviceManager);
});
