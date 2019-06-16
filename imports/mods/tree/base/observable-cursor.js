import { Observable } from 'rxjs';
import { EventBuilder } from '../utils/event-builder';
import { removeObserver } from '../utils/observable-utils';
import omit from 'lodash/omit';
import extend from 'lodash/extend';



export class ObservableCursor extends Observable {
  _cursor = null;
  _hCursor = null;
  _observers = [];


  static create(cursor) {
    return new this(cursor);
  }

  static createForEach(cursor) {
    return new this(cursor).flatMap( x => Observable.from(x));
  }

  constructor(cursor) {
    super(observer => {
      this._observers.push(observer);
      this.doObserveCursor(cursor);

      return () => {
        this._observers = removeObserver(this._observers, observer, () => this.stop());
      };
    });

    extend(this, omit(cursor, 'count', 'map'));

    this._cursor = cursor;
  }

  doObserveCursor(cursor) {
    if (!this._hCursor)
      this._hCursor = this._observeCursor(cursor);
  }

  cursor() {
    return this._cursor;
  }

  stop() {
    this._runComplete();

    if (this._hCursor)
      this._hCursor.stop();

    this._hCursor = null;
  }

  fetch() {
    return this._cursor.fetch();
  }

  _runFetch(observer) {
    const fetch = this.fetch();
    fetch.forEach(doc => observer.next(
      EventBuilder.added({ doc }),
    ));
  }

  _runComplete() {
    this._observers.forEach(observer => {
      observer.complete();
    });
  }

  _added = doc => {
    const e = EventBuilder.added({ doc });
    this._observers.forEach(observer => observer.next(e));
  };

  _changed = (doc, old) => {
    const e = EventBuilder.changed({ doc, old });
    this._observers.forEach(observer => observer.next(e));
  };

  _removed = doc => {
    const e = EventBuilder.removed({ doc });
    this._observers.forEach(observer => observer.next(e));
  };

  _observeCursor(cursor) {
    return cursor.observe({
      added: this._added,
      changed: this._changed,
      removed: this._removed,
    });
  }
}
