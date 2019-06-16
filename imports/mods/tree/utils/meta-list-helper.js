import assert from '../../utils/assert';
import { EventBuilder } from './event-builder';


/**
 * Collect list(array) from add/change/remove flow
 */
export default class ListCollector {
  list = [];
  ready = false;

  constructor(onChange) {
    this.onChange = onChange;
  }

  update() {
    if (this.ready)
      this.onChange(this.list);
  }

  handle = data => {
    if (!EventBuilder.isEvent(data)) {
      this.list.push(data);
      this.update();
      return;
    }

    EventBuilder.apply(data, {
      added: doc => {
        this.list = Array.isArray(doc)
          ? [...this.list, ...doc] :
          [...this.list, doc];

        this.update();
      },
      changed: (doc, old) => {
        const index = this.list.findIndex(i => i._id === doc._id);
        assert(index >= 0, 'wrong index while list change');
        list[index] = doc;

        this.update();
      },
      removed: doc => {
        const index = this.list.findIndex(i => i._id === doc._id);
        assert(index >= 0, 'wrong index while element remove');
        list.splice(index, 1);

        this.update();
      },
      ready: () => {
        this.ready = true;
        this.update();
      }
    });
  }
}
