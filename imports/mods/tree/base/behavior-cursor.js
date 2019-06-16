import { Observable } from 'rxjs';
import _ from 'lodash';

import { EventBuilder } from '../utils/event-builder';
import { removeObserver } from '../utils/observable-utils';

export class BehaviorCursor extends Observable {
  _cursor = null;
  _hCursor = null;
  _observers = [];
  _data = [];

  static create(cursor) {
    return new this(cursor);
  }

  constructor(cursor) {
    super(observer => {
      this._data.forEach(doc =>
        observer.next(EventBuilder.added({ doc })));

      this._observers.push(observer);
      this.doObserveCursor(cursor);

      return () => {
        // TODO: Fix bug, on complete one do will remove the others
        this._observers = removeObserver(this._observers, observer, () => this.stop());
      };
    });

    _.extend(this, _.omit(cursor, 'count', 'map'));

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

  _runComplete() {
    this._observers.forEach(observer => {
      observer.complete();
    });
  }

  _added = doc => {
    this._data.push(doc);
    this._observers.forEach(observer => observer.next(
      EventBuilder.added({ doc })
    ));
  };

  _changed = (doc, old) => {
    const index = this._data.findIndex(item => item._id === doc._id);
    this._data[index] = doc;
    this._observers.forEach(observer => observer.next(
      EventBuilder.changed({ doc, old })
    ));
  };

  _removed = doc => {
    this._data = this._data.filter(i => i._id !== doc._id);
    this._observers.forEach(observer => observer.next(
      EventBuilder.removed({ doc })
    ));
  };

  _observeCursor(cursor) {
    return cursor.observe({
      added: this._added,
      changed: this._changed,
      removed: this._removed,
    });
  }
}
