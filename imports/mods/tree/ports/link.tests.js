import { expect } from 'chai';
import Link from './link.type';
import { Meta, Node } from '../index';
import { addType } from '../base/type-db';
import { NamedNode } from '../../mods/types/named-node/NamedNode.meta';

const M = Meta.inherit({
  name: 'link-test-meta',
  fields: {
    string: String,
  },
});
addType(M);


describe('Links', () => {
  it('meta.fromField', () => {
    const node = new Node({ _id: 'node-id' });
    const meta = node.addMeta(new M({ string: 'Foo' }));
    meta._id = 'meta-id';

    const link = Link.fromField(meta, 'string', 'server');
    expect(link).to.deep.include({
      nodeID: node._id,
      metaID: meta._id,
      field: 'string',
      side: 'server',
    });
  });

  it('meta.fromField - no side', () => {
    const node = new Node({ _id: 'node-id' });
    const meta = node.addMeta(new M({ string: 'Foo' }));
    meta._id = 'meta-id';

    const link = Link.fromField(meta, 'string');
    expect(link).to.deep.include({
      nodeID: 'node-id',
      metaID: 'meta-id',
      field: 'string',
      side: 'server',
    });
  });

  it('node.fromField', () => {
    const node = new Node({ _id: 'node-id' });

    const link = Link.fromField(node, 'children', 'server');
    expect(link).to.deep.include({
      nodeID: 'node-id',
      metaID: undefined,
      field: 'children',
      side: 'server',
    });
  });

  it('namedNode.fromField', () => {
    const node = new NamedNode({ _id: 'node-id', name: 'test' });

    const link = Link.fromField(node, 'children', 'server');
    expect(link).to.deep.include({
      nodeID: 'node-id',
      metaID: undefined,
      field: 'children',
      side: 'server',
    });
  });
});
