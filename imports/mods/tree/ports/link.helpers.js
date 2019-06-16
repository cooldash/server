import { Meteor } from 'meteor/meteor';
import Link from './link.type';
import { Class, MetaCursor} from '../base/meta';
import LinkSide from './link-side';
import { linkHelper } from '../utils/link-helper';
import { NodeRepository } from '../base/repository';
import { NodeLink } from '../utils/node-link';
import { Node } from '../base/node';

const cache = {};

Link.extend({
  helpers: {
    getUrl() {
      return NodeLink.build(this.nodeID, this.metaID, this.field);
    },
    getName() {
      return `${this.nodeID}_${this.metaID}_${this.field}`;
    },
    getValue(useCache = true) {
      const name = this.getName();

      if (!useCache && cache[name] && cache[name].value) {
        delete (cache[name].value);
      }

      if (!cache[name]) {
        cache[name] = { loaded: true, value: null, stream: null };
        cache[name].value = NodeRepository.getRawByLink(this);
      }
      if (!cache[name].value) {
        cache[name].value = NodeRepository.getRawByLink(this);
      }
      return cache[name].value;
    },
    getStream(useCache = true) {
      const name = this.getName();

      if (!useCache && cache[name] && cache[name].stream) {
        delete (cache[name].stream);
      }

      if (!cache[name]) {
        cache[name] = { loaded: true, value: null, stream: null };
        cache[name].stream = NodeRepository.getByLink(this);
      }
      if (!cache[name].stream) {
        cache[name].stream = NodeRepository.getByLink(this);
      }
      return cache[name].stream;
    },

    getNode() {
      return NodeRepository.getByID(this.nodeID);
    },

    getMeta() {
      return NodeRepository
        .getByID(this.nodeID)
        .getMetaById(this.metaID);
    },
  },
});

Link.Side = LinkSide;

Link.getPropertyFields = function () {
  return 'linkType';
};

Link.fromNode = function (node) {
  if (!node) {
    return null;
  }

  return new Link({ nodeID: node._id });
};

Link.fromMeta = function (meta) {
  if (!meta) {
    return null;
  }

  return new Link({ nodeID: meta.node()._id, metaID: meta._id });
};

Link.fromField = function (meta, field, _side) {
  if (!meta)
    return null;

  const side = _side || (meta[field].info && meta[field].info.ns);

  if (meta instanceof Node) {
    return new Link({
      nodeID: meta._id,
      field,
      side,
    });
  }

  return new Link({
    nodeID: meta.node()._id,
    metaID: meta._id,
    field,
    side,
  });
};

Link.toID = link => {
  if (!link.nodeID)
    throw new Error('Cant get id for null link');

  if (!link.metaID)
    return (link.field) ? `${link.nodeID}_${link.field}` : `${link.nodeID}`;

  if (link.field)
    return `${link.nodeID}_${link.metaID}_${link.field}`;

  return `${link.nodeID}_${link.metaID}`;
};

Link.fromID = function (id) {
  const data = id.split('_');

  if (data.length === 2) {
    const [nodeID, field] = data;
    return new Link({ nodeID, field });
  }

  const [nodeID, metaID, field] = data;
  return new Link({ nodeID, metaID, field });
};

const LinkStore = Class.create({
  name: 'LinkStore',
  fields: {
    link: { type: Link },
    metaID: String,
    field: String,
  },
});

Node.extend({
  fields: {
    _lnk: { type: [LinkStore], default: [] },
  },
  helpers: {
    children: linkHelper(
      function() {
        return Node.find({ _p: this._id });
      },
      { type: MetaCursor },
    ),
    links() {
      return this._lnk;
    },
  },
  events: {
    beforeSave(e) {
      if (Meteor.isServer) {
        const self = e.target;

        self._lnk = self._m.reduce(
          (result, meta) => {
            meta.getFields().forEach(field => (
              field.type.name === 'link-field' &&
              meta[field.name] &&
              result.push({
                metaID: meta._id,
                field: field.name,
                link: meta[field.name],
              })
            ));
            return result;
          },
          [],
        );
      }
    },
  },
});
