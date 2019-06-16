/**
 * Created by kriz on 01/11/16.
 */

import { Class, Type } from 'meteor/treenity:astronomy';
import flattenDeep from 'lodash/flattenDeep';
import each from 'lodash/each';
import last from 'lodash/last';
import first from 'lodash/first';
import intersection from 'lodash/intersection';
import { getTypeName } from './get-type-name';

export const typeContexts = {};
export const types = {};

// XXX
const getComponentOfType = (type, items) => {
  const source = Object
    .keys(type)
    .map(item => item.split(' '));

  const flatItems = flattenDeep([items]);
  const excludeMatch = flatItems.filter(item => item[0] === '-').map(item => item.substr(1));
  const arrContext = flatItems
    .filter(item => !(excludeMatch.includes(item) || (item[0] === '-' && excludeMatch.includes(item.substr(1)))));

  const intersections = source
    .filter(arr => arr.length && (last(arrContext) === last(arr)))
    .map(sourceTags => ({ source: sourceTags, intersect: intersection(sourceTags, arrContext) }))
    .map(items => [items.source, items.intersect.length])
    .filter(arr => !!arr[1])
    .sort(function (a, b) {
      return b[1] - a[1] && b[0].length - a[0].length;
    });

  if (!intersections || !intersections.length) {
    if (type !== typeContexts.default && typeContexts.default) {
      return getComponentOfType(typeContexts.default, items);
    }

    return null;
  }

  const tags = intersections
    .map(sourceTags => {
      const intersect = intersection(sourceTags[0], items);
      return { source: sourceTags[0], intersect, len: intersect.length };
    })
    .sort((a, b) => b.len - a.len);

  const tagString = first(tags).source.join(' ');

  return type[tagString];
};

// XXX rewrite components and types registration
export function addComponent(component, type, context = 'default', config = {}) {
  if (!component) {
    console.warn('Component is undefined while adding', type, context);
  }

  const typeName = getTypeName(type);
  if (!types[typeName])
    types[typeName] = type;

  let variants = typeContexts[typeName];
  if (!variants)
    variants = typeContexts[typeName] = {};

  // save type-context-component relation to our db
  if (Array.isArray(context))
    context.forEach(c => { variants[c] = { component, ...config }; });
  else if (typeof context === 'object')
    each(context, (metaData, name) => { variants[name] = { ...config, ...metaData, component }; });
  else if (typeof context === 'string')
    variants[context] = { component, ...config };
  else
    throw new TypeError(`context of unknown type: ${typeof context}`);
}

export function getComponentInfo(type, context = []) {
  const typeName = getTypeName(type);

  const variants = typeContexts[typeName] || typeContexts.notfound;

  if (!variants)
    return null;

  return getComponentOfType(variants, context);
}

export function getComponent(type, context = []) {
  const info = getComponentInfo(type, context);
  if (!info) {
    console.warn('Component not found for type', getTypeName(type), 'and context', context);
    return null;
  }
  return info.component;
}

export function typesList() {
  return types;
}

export function addType(type) {
  const typeName = getTypeName(type);
  if (!typeName)
    throw new Error(`type type is of unknown type ${type}`);

  types[typeName] = type;
}

export function getType(_t) {
  // XXX !!! className is BAD criteria
  if (_t.className)
    return _t;
  return types[_t];
}

