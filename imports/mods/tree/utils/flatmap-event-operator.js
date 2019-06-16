import { Observable } from 'rxjs';
import { MetaMethod } from '../base/meta';

export const flatMapEvent = (funcDoc, funcOld = d => d) => source => new Observable(observer => {
  source.subscribe(
    e => {
      //TODO: On change fix
      const _resultDoc = funcDoc(e.getDoc());
      //TODO: MetaMethod remove from here
      const result = (_resultDoc instanceof MetaMethod) ? _resultDoc.func() : _resultDoc;

      if (result instanceof Observable) {
        if (result.next) {
          observer.next(e.map(result, e.getOld()));
          return;
        }

        result.subscribe(_e => observer.next(_e));
      } else {
        observer.next(e.map(funcDoc, funcOld));
      }
    },
    err => observer.error(err),
    () => observer.complete(),
  );
});
