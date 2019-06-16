import { Module } from 'meteor/jagi:astronomy';
const throwParseError = Module.get('core').utils.throwParseError;

const throwError = (Class, message) => throwParseError([
  { 'class': Class.getName() },
  { 'behavior': 'slug' },
  message,
]);

function check(Class) {
  if (this.options.fieldName && this.options.helperName) {
    throwError(Class, 'Can not generate a slug from the field and method at the same time');
  }
  else if (this.options.fieldName) {
    if (!Class.hasField(this.options.fieldName)) {
      throwError(Class, `The "${this.options.fieldName}" field that does not exist`);
    }
  }
  else if (this.options.helperName) {
    if (!Class.hasHelper(this.options.helperName)) {
      throwError(Class, `The "${this.options.helperName}" helper that does not exist`);
    }
  }
  else {
    throwError(Class, 'Provide "fieldName" or "helperName" as a source of a slug');
  }
}

export default check;