import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { typeName } from 'meteor/treenity:astronomy';

import { addType } from './type-db';
import Port from '../ports/Port';
import { ObservableCursor } from './observable-cursor';
import { Meta } from './meta';
import { getTypeName } from './get-type-name';

export const NodeCol = new Meteor.Collection('nodes');
/**
 * Node is a collection of named and unnamed metas
 */
export const Node = Meta.inherit({
  secured: false, // TODO
  name: 'node',
  collection: NodeCol,
  typeField: '_t',
  fields: {
    _p: String, // parent ID
    _pa: [String], // full node path (dont need, maybe, we need cache, not store)
    _l: Number,
    _m: { type: [Meta], default: [] },
    children: { type: Port, dir: 'both', side: 'out', ns: Port.NS.SERVER },
  },

  helpers: {
    createChild(Type = Node, data = {}, beforeSave = node => {}) {
      const child = new Type({
        _t: getTypeName(Type),
        _p: this._id,
        _pa: [...this._pa, this._id],
        _l: this._l + 1,
        _m: [],
        ...data,
      });

      if (beforeSave)
        beforeSave(child);

      child.save();
      return child;
    },

    addMeta(Type, data) {
      const meta = typeof Type === 'function' ? new Type(data) : Type;
      meta._t = meta._t || getTypeName(meta);
      meta._id = Random.id();
      meta.__node = this;
      this._m.push(meta);
      this._updated();

      return meta;
    },

    removeMeta(meta) {
      const i = this._m.findIndex(m => m._id === meta._id);
      if (i < 0)
        return false;

      this._m.splice(i, 1);
      this._updated();
      return true;
    },

    removeMetaByType(metaType) {
      const i = this._m.findIndex(m => m._t === metaType);
      if (i < 0)
        return false;

      this._m.splice(i, 1);
      this._updated();
      return true;
    },

    removeMetaSave(meta) {
      if (this.removeMeta(meta))
        this.save();
    },

    hasMeta(metaType) {
      return !!this.getMeta(metaType);
    },

    meta() {
      return this._m;
    },

    getTypes() {
      const types = this._m ? this._m.map(m => m._t) : [];
      types.push(this._t);
      return types;
    },

    setParent(parent) {
      this._p = parent._id;
      if (!parent._pa)
        return;

      if (!this._id)
        throw new Error('Node doesn`t have ID');

      this._pa = [...parent._pa, parent._id];
    },

    isRoot() {
      return this._p === 'null';
    },

    getChildren() {
      return Node.find({ _p: this._id });
    },

    findChild(q) {
      return Node.findOne({ ...q, _p: this._id });
    },

    findChildMetaOf(type, q) {
      const node = Node.findOne({ '_m._t': getTypeName(type), ...q, _p: this._id });
      return node.getMeta(type);
    },

    findChildren(q) {
      return Node.find({ ...q, _p: this._id })
        .fetch();
    },

    allChildren() {
      return Node.find({ _pa: this._id })
        .fetch();
    },

    allChildrenCursor() {
      return Node.find({ _pa: this._id });
    },

    allChildrenRx() {
      this.__allChildrenRx = this.__allChildrenRx || ObservableCursor.create(Node.find({ _pa: this._id }));
      return this.__allChildrenRx;
    },

    hasChildren() {
      return !!Node.find({ _p: this._id }).count();
    },
    getMeta(type) {
      const typeName = getTypeName(type);
      return this._m.find(m => m._t === typeName);
    },

    getMetaById(_id) {
      return this._m.find(m => m._id === _id);
    },

    _updated() {
      if (this.__track)
        this.__track.changed();
    },

    trackUpdated() {
      this.__track = this.__track || new Tracker.Dependency();
      if (Tracker.active)
        this.__track.depend();
    },

    // TODO: Copy to self bug
    copyTo(dest, beforeSave) {
      const copy = this.copy();
      copy.onCopy();
      copy.setParent(dest);

      copy._m.forEach(meta => meta.onCopy());

      if (beforeSave)
        beforeSave(copy);


      copy.save();

      Node.find({ _p: this._id })
        .forEach(child => child.copyTo(copy));

      return copy;
    },

    onCopy() {
      this._id = Random.id();
      const self = this;
      this._m.forEach(m => { m.__node = self; });
    },

    removeNode() {
      Node.remove({ _id: this._id });
    },
  },

  events: {
    afterInit(e) {
      const self = e.target;
      self._m.forEach(m => {
        m.__node = self;
      });
    },
  },
});

Node.inheritEx = function (def, helpers) {
  const ex = this.inherit(def);
  ex.helpers = { ...this.helpers };
  Object.assign(ex, ex.helpers, helpers);
  return ex;
};

Node.helpers = {
  _rootData: { _p: 'null' },
  getRoot() {
    return this.findOne(this._rootData);
  },
  findOneByMeta(type, opts = {}) {
    return this.findOne({ _m: { $elemMatch: { _t: typeName(type), ...opts } } });
  },
  findOneByMetaID(id, opts = {}) {
    return this.findOne({ '_m._id': id }, opts);
  },
};

addType(Node);
Object.assign(Node, Node.helpers);
