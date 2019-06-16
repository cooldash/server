import { expect } from 'chai';
import { Class } from 'meteor/treenity:astronomy';

describe('Astronomy', function () {
  this.timeout(600000);
  it('can extend meta', () => {
    const Meta = Class.create({
      name: 'meta',
      typeField: '_t',
      fields: {
        _id: String,
        _t: String,
      },
    });


    const SomeClass = Class.create({
      name: 'some-class',
      fields: {
        someField: String,
      },
    });

    const SomeMeta = Meta.inherit(SomeClass);

    console.log(SomeMeta);

  });
});
