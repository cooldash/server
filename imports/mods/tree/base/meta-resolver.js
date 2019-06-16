import { NodeRepository } from './repository';

export class MetaResolver {
  metas = {};

  resolve(link) {
    const id = link.metaID || link.nodeID;

    if (!id)
      throw new Error('Cant resolve link: link format incorrect');

    if (this.metas[id])
      return this.metas[id];

    let meta;
    if (link.nodeID)
      meta = NodeRepository.getByID(link.nodeID);

    if (link.metaID)
      meta = meta.getMetaById(link.metaID);

    // XXX meta will not be updated from db if changed
    this.metas[id] = meta;
    return meta;
  }
}
