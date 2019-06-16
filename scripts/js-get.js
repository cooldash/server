#!/usr/bin/env node

const file = process.argv[1];
const varName = process.argv[2];

const data = require(file);
const get = require('lodash/get');

try {
  const value = get(data, varName);
  console.log(value);
} catch (err) {
  console.error(err);
}
