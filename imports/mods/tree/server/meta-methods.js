import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { NodeRepository } from '../base/repository';

Meteor.methods({
  'runMeta'(metaID, method, params) {
    check(metaID, String);
    check(method, String);
    check(params, Array);

    const meta = NodeRepository.getMetaById(metaID);
    if (!meta) throw new Error('Meta not found', { metaID, method });

    const func = meta.getType().definition.metaMethods[method];
    if (!func || typeof func !== 'function') throw new Error('Method not found', { metaID, method });

    meta.context = this;
    return func.apply(meta, params);
  },
});
