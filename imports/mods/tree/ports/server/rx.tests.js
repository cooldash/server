import chai, { expect } from 'chai';
import { take, skip, elementAt } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { toPromise } from './utils';

chai.use(require('chai-as-promised'));

describe('Understand RX', function () {
  it('skip', () => {
    const firstMessage = (sub, n) => {
      if (n) return sub.pipe(skip(n), take(1));
      return sub.pipe(take(1));
    };

    const s = new Subject();
    const p1 = toPromise(firstMessage(s, 0));
    const p2 = toPromise(firstMessage(s, 1));
    const p3 = toPromise(firstMessage(s, 2));


    s.next('1');
    s.next('2');
    s.next('3');

    expect(p1).to.eventually.equal('1');
    expect(p2).to.eventually.equal('2');
    expect(p3).to.eventually.equal('3');
  });

  it('elementAt', () => {
    const firstMessage = (sub, n = 0) => sub.pipe(elementAt(n));

    const s = new Subject();
    const p1 = toPromise(firstMessage(s, 0));
    const p2 = toPromise(firstMessage(s, 1));
    const p3 = toPromise(firstMessage(s, 2));


    s.next('1');
    s.next('2');
    s.next('3');

    expect(p1).to.eventually.equal('1');
    expect(p2).to.eventually.equal('2');
    expect(p3).to.eventually.equal('3');
  });
});
