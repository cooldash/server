import { Module } from 'meteor/jagi:astronomy';
import bind from 'lodash/bind';
import each from 'lodash/each';
import merge from 'lodash/merge';
// import generateSlug from './generateSlug';
// import { afterInit, beforeSave } from "./events";
// import Class from "../../../../../.meteor/packages/jagi_astronomy/2.5.6/web.browser/lib/core/class";

Module.create({
  name: 'meta-methods',
  options: {
    description: null,
    ports: {},
  },


  onInitDefinition(parsedDefinition, className) {

  },
  // Parse the extending definition and put parsed properties in the parsed
  // definition.
  onParseDefinition(parsedDefinition, extendDefinition, className) {
    parsedDefinition.metaMethods = extendDefinition.metaMethods;
  },
  // Apply parsed definition.
  onApplyDefinition(Class, parsedDefinition, className) {

  },
  // Merge parsed definition with a class definition.
  onMergeDefinitions(definition, parsedDefinition, className) {

    definition.metaMethods = definition.metaMethods
      ? merge(definition.metaMethods, parsedDefinition.metaMethods)
      : parsedDefinition.metaMethods;
  },
  // Finalize class creation.
  onFinalizeClass(Class, className) {
    each(Class.definition.metaMethods, (value, name) => {
      if (value) {
        Class.prototype[name] = function (...params) {
          return Meteor.call('runMeta', this._id, name, params);
        }
      }
    });
  },


  // createClassDefinition() {
  //   const opt = this.options;
  //   const definition = {
  //     fields: {
  //     },
  //     flo: {
  //       description: opt.description,
  //     },
  //     events: {
  //       afterInit: bind(afterInit, this),
  //       beforeSave: bind(beforeSave, this)
  //     }
  //   };
  //
  //   return definition;
  // },
  // apply(Class) {
  //   Class.extend(this.createClassDefinition(), ['fields', 'events', 'flo']);
  // },
  // generateSlug
});
