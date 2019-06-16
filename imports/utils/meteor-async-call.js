import { Meteor } from 'meteor/meteor';

/**
 * Wrap Meteor.call with promise
 * @param methodName - name of the Meteor method to call
 * @param args - args of method
 * @return {Promise<any>} - promise which will be resolved on method return
 */
function meteorCall(methodName, ...args) {
  return new Promise((res, rej) => {
    Meteor.call(methodName, ...args, (err, result) => (err ? rej(err) : res(result)));
  });
}

export default meteorCall;
