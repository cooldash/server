/* eslint-disable new-cap */
/**
 * Created by kriz on 01/11/16.
 */

import { Class, Enum } from 'meteor/treenity:astronomy';
import { Random } from 'meteor/random';

import { addType, getType } from './type-db';
import filterFieldsByType from '../utils/filterFieldsByType';
import Port from '../ports/Port';


export { Class, Enum };

export class MetaCursor {
}

export class MetaMethod {
  constructor(type, func) {
    this.type = type;
    this.func = func;
  }

  execute(...args) {
    if (this.func)
      this.func(args);
  }
}

/**
 * Meta is a component of node - minimal pack of saving information
 * metas are typed and are base for all other save containers
 */
export const Meta = Class.create({
  name: 'meta',
  typeField: '_t',
  fields: {
    // type
    _t: {
      type: String, default: doc => doc.constructor.className,
    },
    // tags
    _tg: {
      type: [String], default: [],
    },
    _id: {
      type: String, default: () => Random.id(),
    },
  },
  helpers: {
    type() {
      return this._t;
    },

    getType() {
      return getType(this._t);
    },

    getFields(excludeInternal = false) {
      const type = this.getType();
      if (!type) {
        console.warn('No type for', this._t, this._id);
        return [];
      }
      const fields = type.getFields();

      if (excludeInternal)
        return fields.filter(f => f.name[0] !== '_');

      return fields;
    },

    // getLinkMethods() {
    //   const helpers = this.getType()
    //     .getHelpers();
    //
    //   return Object
    //     .keys(helpers)
    //     .filter(key => helpers[key].link)
    //     .map(key => ({ name: key, ...helpers[key].link }));
    // },
    //
    getLinkByName(name) {
      const field = this.getFields().find(f => f.name === name);

      if (field)
        return this[field.name];

      throw new Error(`Field or meta '${name}' not found on ${this._id}`);
    },

    node() {
      return this.__node;
    },

    addTag(tag) {
      this._tg = [...this._tg, tag];
    },

    addTags(newTags) {
      const oldTags = this._tg;
      this._tg = [...oldTags, ...newTags];
    },

    removeTag(tag) {
      this._tg = this._tg.filter(i => i !== tag);
    },

    hasTag(tag) {
      return this._tg.includes(tag);
    },

    onCopy() {
      this._id = Random.id();
    },

    _initPorts() {
      const autoInit = (mType, type, cb) => {
        cb = cb || (() => {});
        return filterFieldsByType(mType, type).forEach(field => {
          let value = this[field.name];
          if (!value) // eslint-disable-next-line no-multi-assign
            value = this[field.name] = new field.type.class();

          cb(value, field);
        });
      };

      const metaType = this.getType();
      autoInit(metaType, Port, (port, field) => {
        // TODO: check all ports to verify they r all correct

        Object.assign(port, {
          // side: field.side,
          get info() {
            return {
              ...field,
              ns: field.ns || field.side || 'server',
              dir: field.dir || 'both',
              portSide: field.portSide || field.dir || 'out',
              stated: field.stated || false,
            };
          },
        });
      });
    },

    toString() {
      return `${this._t} (${this.node()} : ${this._id})`;
    },
  },
  events: {
    afterInit(e) {
      const doc = e.currentTarget;
      doc._initPorts();
    },
  },
  behaviors: {
    timestamp: {},
  },
});

Meta.create = function () {
  throw new Error('call Meta.inherit to create new type');
};

addType(Meta);

