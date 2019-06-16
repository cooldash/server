import { Observable } from 'rxjs';

export const copyTo = (dest, beforeSaveCB) => source => new Observable(observer => {
  source.subscribe(
    e => e({
      added: doc => {
        if (doc.hasOwnProperty('copyTo'))
          throw new Error("Object has no copyTo implemented method");

        const copy = doc.copyTo(dest, beforeSaveCB);
        observer.next(e.map(copy));
      },
    }),
    err => observer.error(err),
    () => observer.complete(),
  );
});
