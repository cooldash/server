import { toStringDeep } from '../to-string';

describe('ToString', () => {
  it('ToStringDeep', () => {
    console.log(toStringDeep({
      test: 'test',
      n: 10,
      x: Object.assign(Object.create(Function), { a: 5, toString() { return this.a + '%%'; } }),
    }));
  });
});
