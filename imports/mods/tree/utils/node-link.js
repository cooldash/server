import { DeepLink } from './deep-link'

const NODE_PROTO = "node";

export class NodeLink {
  //TODO: Move to link parser with handlers
  static parse(link) {
    const result = DeepLink.parse(link);
    return {
      nodeID: result.items[0],
      metaID: result.items[1],
      field: result.params['field']
    };
  }

  static build(node, meta, field) {
    let items = [];
    if (!node)
      return "";

    items = [...items, node._id];

    if (meta)
      items = [...items, meta._id];

    return DeepLink.build(NODE_PROTO, items, {field});
  }
}
