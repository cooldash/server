import { Module } from 'meteor/jagi:astronomy';
import bind from 'lodash/bind';
import merge from 'lodash/merge';
// import generateSlug from './generateSlug';
// import { afterInit, beforeSave } from "./events";
// import Class from "../../../../../.meteor/packages/jagi_astronomy/2.5.6/web.browser/lib/core/class";

Module.create({
  name: 'flo',
  options: {
    description: null,
    ports: {},
  },


  onInitDefinition(parsedDefinition, className) {
    if (Meteor.isClient) {

    } else if (Meteor.isServer) {
      parsedDefinition.metaMethods
    }
  },
  // Parse the extending definition and put parsed properties in the parsed
  // definition.
  onParseDefinition(parsedDefinition, extendDefinition, className) {
    parsedDefinition.flo = extendDefinition.flo;
  },
  // Apply parsed definition.
  onApplyDefinition(Class, parsedDefinition, className) {

  },
  // Merge parsed definition with a class definition.
  onMergeDefinitions(definition, parsedDefinition, className) {

    definition.flo = definition.flo
      ? merge(definition.flo, parsedDefinition.flo)
      : parsedDefinition.flo;
  },
  // Finalize class creation.
  onFinalizeClass(Class, className) {

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
