import { Meteor } from 'meteor/meteor';
// Detecting changes of array when we try to iterate the one

if (Meteor.isDevelopment) {
  Array.prototype.forEach = function (cb, context) {
    const len = this.length;
    for (let i = 0; i < len; i++) {
      cb.call(context, this[i], i, this);
      if (this.length !== len) {
        throw new Error('array len changed after iteration');
      }
    }
  };
}
