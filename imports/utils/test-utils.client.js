import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { first } from 'rxjs/operators';


const firstMessage = sub => sub.pipe(first()).toPromise();
export const firstData = sub => firstMessage(sub).then(m => m.data);

export const waitTree = () => {
  let treeLoaded = false;
  let waiting = [];
  Tracker.autorun(function () {
    const sub = Meteor.subscribe('tree');
    if (sub.ready()) {
      treeLoaded = true;
      waiting.forEach(w => w());
      waiting = [];
    }
  });

  return new Promise(resv => {
    if (treeLoaded)
      resv();
    else {
      waiting.push(resv);
      Meteor.call('publishTree');
    }
  });
};
