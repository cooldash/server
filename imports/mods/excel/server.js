import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { identity } from 'lodash';

import XLSX from 'xlsx';
import mapToObject from '../../utils/map-to-object';


const resolvers = {};
const dataResolvers = {};

export function addExcelColumnResolver(field, createResolver) {
  resolvers[field] = createResolver;
}
export function addExcelPatcher(sub, patcher) {
  dataResolvers[sub] = patcher;
}

function makeResolvers(fields) {
  return mapToObject(fields, fn => ([
    fn, // key of res
    ((resolvers[fn] && resolvers[fn]()) || identity), // value
  ]));
}

function generateExcel(sheets) {
  /* generate a workbook object otherwise */
  const wb = XLSX.utils.book_new();
  sheets.forEach(({ name, data }) => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, name);
  });

  return wb;
}

Meteor.methods({
  async 'excel.generate'(subscription, ...args) {
    check(subscription, String);
    const handler = Meteor.default_server.publish_handlers[subscription];
    if (!handler) {
      throw new Error(`subscription handler not found: ${subscription}`);
    }

    let cursors = handler.apply(this, args);
    if (!Array.isArray(cursors)) cursors = [cursors];

    const fetched = [];
    for await (c of cursors) {
      fetched.push(c.fetch());
    }

    const objToSheet = objects => {
      const type = objects[0].constructor;
      const typeName = type.className || 'unknown';
      let fields = type.className
        ? type.getFields().map(f => f.name)
        : Object.keys(objects[0]);

      let rows;
      // patch data if needed
      const dataResolver = dataResolvers[subscription];
      if (dataResolver) {
        ([fields, rows] = dataResolver(typeName, fields, objects));
      } else {
        const objToRow = obj => fields.map(fieldName => {
          const value = obj[fieldName];
          return value == undefined ? '' : value;
        });
        rows = objects.map(objToRow);
      }

      const res = makeResolvers(fields);
      const patchRows = row => fields.map((fieldName, i) => {
        const value = res[fieldName](row[i]);
        return value;
      });
      rows = rows.map(patchRows);

      return {
        name: typeName,
        data: [
          fields,
          ...rows,
        ],
      };

    };

    const sheetsData = fetched.filter(o => o.length).map(objToSheet);

    const wb = generateExcel(sheetsData);
    const base64 = XLSX.write(wb, { type: 'base64' });

    return { base64 };
  },
});
