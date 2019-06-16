import { Module } from 'meteor/jagi:astronomy';
import bind from 'lodash/bind';
import merge from 'lodash/merge';
// import generateSlug from './generateSlug';
// import { afterInit, beforeSave } from "./events";
// import Class from "../../../../../.meteor/packages/jagi_astronomy/2.5.6/web.browser/lib/core/class";

Module.create({
  name: 'icon',
  options: {
    description: null,
    ports: {},
  },

  onInitDefinition(parsedDefinition, className) {
  },

  // Parse the extending definition and put parsed properties in the parsed
  // definition.
  onParseDefinition(parsedDefinition, extendDefinition, className) {
    parsedDefinition.icon = extendDefinition.icon;
  },
  // Apply parsed definition.
  onApplyDefinition(Class, parsedDefinition, className) {
    Class.icon = parsedDefinition.icon;
  },
  // Merge parsed definition with a class definition.
  onMergeDefinitions(definition, parsedDefinition, className) {
    definition.icon = parsedDefinition.icon;
  },
  // Finalize class creation.
  onFinalizeClass(Class, className) {

  },
});
