import { Observable } from 'rxjs/index';
import { removeObserver } from '../utils/observable-utils';
import { EventBuilder } from '../utils/event-builder';

export class ObservableSimple extends Observable {
  _observers = [];

  constructor(data) {
    super((observer) => {
      this._observers.push(observer);

      if (Array.isArray(data)) {
        data.forEach(item => observer.next(EventBuilder.added({doc: item})));
      }
      else {
        observer.next(EventBuilder.added({doc: data}));
      }

      observer.complete();

      return () => {
        this._observers = removeObserver(this._observers, observer);
      }
    });
  }
}
