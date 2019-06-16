import { Behavior } from 'meteor/jagi:astronomy';
import bind from 'lodash/bind';
import generateSlug from './generateSlug';
import { afterInit, beforeSave } from "./events";

Behavior.create({
  name: 'flo',
  options: {
    description: null,
    ports: {},
  },
  createClassDefinition() {
    const opt = this.options;
    const definition = {
      fields: {
      },
      flo: {
        description: opt.description,
      },
      events: {
        afterInit: bind(afterInit, this),
        beforeSave: bind(beforeSave, this)
      }
    };

    return definition;
  },
  apply(Class) {
    Class.extend(this.createClassDefinition(), ['fields', 'events', 'flo']);
  },
  generateSlug
});
