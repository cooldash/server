import { EMPTY } from 'rxjs';
import assert from 'assert';
import Cache from 'js-cache';
import { Meteor } from 'meteor/meteor';
import { MetaCursor } from './meta';
import { ObservableCursor } from './observable-cursor';
import { mapEvent } from '../utils/map-event-operator';
import { flatMapEvent } from '../utils/flatmap-event-operator';
import { Node } from './node';
import { getTypeName } from './get-type-name';

class NodeRepositoryClass {
  constructor() {
    // create cache and get from db if not found
    const cache = new Cache();
    this.cache = cache;

    Meteor.startup(() => {
      // update cache on changes
      Node.find({}).observe({
        changed(node) {
          cache.set(node._id, node);
        },
        removed(node) {
          cache.del(node._id);
        },
      });
    });
  }

  onNodeUpdate(_id, callback) {
    const upKey = `update:${_id}`;
    const delKey = `del:${_id}`;
    // first init this key, so subsequental set will call update callbacks
    // XXX dont get it from db here, the hack
    this.cache.set(_id, this.cache.get(_id));

    this.cache.on(upKey, callback);
    this.cache.on(delKey, callback);
    return () => {
      this.cache.off(upKey, callback);
      this.cache.off(delKey, callback);
    }
  }

  getByID(nodeID) {
    let node = this.cache.get(nodeID);
    if (!node) {
      node = Node.findOne({ _id: nodeID }, { reactive: false });
      this.cache.set(nodeID, node);
    }
    return node;
  }

  getNodeById = (id, initialOnly = true) => {
    const cursor = Node.find({ _id: id }, { reactive: initialOnly });
    return ObservableCursor.create(cursor);
  };


  getMetaById = (id, initialOnly = false, asRx = false) => {
    const node = Node.findOne({ '_m._id': id }, { reactive: initialOnly });

    if (!node) {
      return null;
    }

    if (asRx) {
      return ObservableCursor
        .create(node)
        .pipe(mapEvent(doc => {
          const m = doc.getMetaById(id);
          if (m) {
            return m;
          }

          throw new Error('Meta not found');
        }));
    }

    const m = node.getMetaById(id);
    if (!m) {
      throw new Error(`Meta with id: ${id} not found`);
    }

    return m;
  };

  /**
   * Find links to this metaID
   * @param id
   */
  linksToMeta = id => {
    const nodes = Node.find({ '_lnk.link.metaID': id }).fetch();
    const metas = [];
    nodes.forEach(node => node._lnk.forEach(lnk => {
      if (lnk.link.metaID === id) {
        metas.push(node.getMetaById(lnk.metaID));
      }
    }));
    return metas;
  };

  getRawByLink = link => {
    const { nodeID, metaID, field } = link;

    if (!nodeID) {
      return null;
    }

    const node = Node.findOne({ _id: nodeID }, { reactive: false });

    if (metaID) {
      const meta = node.getMetaById(metaID);

      // Field of meta
      if (field) {
        return meta.getLinkByName(field);
      }

      return meta;
    }

    // Field of node
    if (field) {
      return node.getLinkByName(field);
    }

    return node;
  };

  // Get data from link
  getByLink = (link, asObservable = false) => {
    const { nodeID, metaID, field } = link;

    if (!nodeID) {
      return EMPTY;
    }

    const cursor = Node.find({ _id: nodeID }, { reactive: !asObservable });
    const node = cursor.fetch()[0];

    if (field && node) {
      const _field = (metaID)
        ? node.getMetaById(metaID).getLinkByName(field)
        : node.getLinkByName(field);

      //TODO: Map collection cursor
      if (_field && _field.type === MetaCursor) {
        return ObservableCursor.create(_field.func());
      }
    }

    const observable = NodeRepository.getById(nodeID, !asObservable);

    if (metaID) {
      const metaObservable = observable.pipe(
        mapEvent(doc => doc.getMetaById(metaID)),
      );

      // Field of meta
      if (field) {
        return metaObservable.pipe(
          flatMapEvent(meta => meta && meta.getLinkByName(field)),
        );
      }

      return metaObservable;
    }

    // Field of node
    if (field) {
      return observable.pipe(
        flatMapEvent(_node => _node.getLinkByName(field)),
      );
    }

    return observable;
  };

  removeNodeById = nodeID => {
    Node.remove({ _id: nodeID });
  };

  removeNode = node => {
    if (node) {
      Node.remove({ _id: node._id });
    }
  };

  findNodeByMetaType(type, selector) {
    const nodes = this.findCursorByMetaType(type, selector, { limit: 1 }).fetch();
    return nodes.length ? nodes[0] : null;
  }

  findCursorByMetaType(type, selector, options) {
    const typeName = getTypeName(type);
    return Node.find({ _m: { $elemMatch: { ...selector, _t: typeName } } }, options);
  }

  findNodes(selector, options) {
    return Node.find(selector, options);
  }
}

export const NodeRepository = new NodeRepositoryClass();
