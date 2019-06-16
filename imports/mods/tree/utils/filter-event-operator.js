import { Observable } from 'rxjs';
import _ from 'lodash'

export const filterEventType = mask => source => new Observable(observer => {
  source.subscribe(
    e => {
      const event = e.getEvent();
      if (_.includes(mask, event))
        observer.next(e);
    },
    err => observer.error(err),
    () => observer.complete(),
  );
});


export const filterEvent = func => source => new Observable(observer => {
  source.subscribe(
    e => {
      if (func(e.getDoc(), e.getOld()))
        observer.next(e);
    },
    err => observer.error(err),
    () => observer.complete(),
  );
});
