import { Meteor } from 'meteor/meteor';
import mapValues from 'lodash/mapValues';
import { Class, Enum } from '../mods/tree';

const collected = {};
const getId = tt => {
  const id = (typeof tt === 'object' ? tt.id : tt);
  collected[id] = true;
  return id;
};

// enum patched to suppoer i18n
const enumCreateOrig = Enum.create;
Enum.create = def => enumCreateOrig.call(Enum, {
  name: getId(def.name),
  identifiers: mapValues(def.identifiers, getId),
});

// class patched to suppoer i18n
const classCreateOrig = Class.create;
Class.create = ({ name, fields, ...other }) => {
  Object.keys(fields).forEach(getId);

  return classCreateOrig.call(Class, {
    name: getId(name),
    fields,
    ...other,
  });
};

// generate i18n values to file, so that it later could be collected by lingui
export const saveCollected = () => {
  if (Meteor.isDevelopment) {
    const ids = Object.keys(collected).map(id => `  t\`${id}\``).join(',\n');
    const text = `import { t } from '@lingui/macro';\nconst ids = [\n${ids}\n]`;
    const path = process.cwd() + '/../../../../../imports/auto-collected-i18n-strings.jsx';
    require('fs').writeFileSync(path, text);
  }
};
