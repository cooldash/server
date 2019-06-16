import { Observable } from 'rxjs';

export const mapEvent = (funcDoc, funcOld = d => d) => source => new Observable(observer => {
  source.subscribe(
    e => observer.next(e.map(funcDoc, funcOld)),
    err => observer.error(err),
    () => observer.complete(),
  );
});
