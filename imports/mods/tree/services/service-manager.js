import { check, Match } from 'meteor/check';
import { debug, error, warn } from '../../utils/log';
import '../../utils/match';

import { getComponent } from '../base/type-db';
import { NodeRepository } from '../base/repository';

export default class ServiceManager {
  enabledServices = {};
  services = {};

  constructor(portManager) {
    check(portManager, Match.NotNull);

    this.portManager = portManager;
  }

  async startService(meta, dontThrow = false) {
    // check(meta, Match.NonNull);

    if (!meta)
      throw new Error('Meta not found');

    if (!this.services[meta._id])
      debug('SM', `starting ${meta}`);

    if (this.services[meta._id])
      return this.services[meta._id];

    const Component = getComponent(meta._t, ['service']);

    if (!Component)
      return warn(`Component for type ${meta._t} not found`);
      // throw new Error(`Component for type ${meta._t} not found`);

    try {
      const instance = new Component({ meta, portManager: this.portManager });
      this.services[meta._id] = instance;

      await this.onInitInstance(instance);

      if (typeof instance.willUpdate === 'function') {
        instance.__stopUpdates = NodeRepository.onNodeUpdate(
          meta.node()._id,
          node => {
            const newMeta = node && node.getMetaById(meta._id);
            if (!newMeta) // node or meta removed, need to stop service
              this.stopService(meta);
            else {
              instance.willUpdate(newMeta);
              instance.props.meta = newMeta;
            }
          }
        )
      }

      return instance;
    } catch (err) {
      delete this.services[meta._id];
      error('SM', `Exception while service ${meta} start`, err);
      if (Meteor.isTesting || !dontThrow)
        throw err;
    }
    return null;
  }

  stopService(meta) {
    debug('SM', `stopping ${meta}`);

    const instance = this.services[meta._id];
    if (!instance)
      throw new Error(`service with meta ID ${meta} not found while stopping`);

    instance.__stopUpdates();
    delete this.services[meta._id];
    try {
      this.onDestroyInstance(instance);
    } catch (err) {
      error('SM', `Exception while service ${meta} stop`, err);
    }
  }

  async onInitInstance(instance) {
    instance.willInit(instance.props);
    // instance.startService(instance.props);
    await instance.didInit(instance.props);

    instance.sockets.forEach(s => {
      if (!s._ready) {
        warn('SM', `socket ${s.id} on ${instance.props.meta} not ready after init`);
      }
    });
  }

  onDestroyInstance(instance) {
    instance.willDestroy(instance.props);
    // instance.stopService(instance.props);
    instance.didDestroy(instance.props);
  }

  // ///////////////////////////////////////////////////////////////

  getStatus = service => {
    if (!service)
      throw new Error('Service not found');

    return this.enabledServices[service.name];
  };

  start = (service, onResult) => {
    let name = service;
    if (service.name) {
      name = service.name;
    }

    if (!this.services[name]) {
      throw new Error('Service not found');
    }

    if (this.enabledServices[name]) {
      warn('Service already started');
      return;
    }

    service.runService(() => {
      this.enabledServices[name] = service;
      onResult();
    });
  };

  stop = (service, onResult) => {
    let name = service;
    if (service.name) {
      name = service.name;
    }

    if (!this.services[name]) {
      throw new Error('Service not found');
    }

    if (!this.enabledServices[name]) {
      console.log('Service not started');
      return;
    }

    service.stopService(() => {
      delete this.enabledServices[name];
      onResult();
    });
  };

  restart = name => {
    this.stop(name, () => {
      this.start(name);
    });
  }
}
