#!/usr/bin/env bash

# somehow link to @babel/runtime not created anymore with meteor build, so create it by ourselves
ln -sf  ../../../../../../../../node_modules/@babel/runtime  .meteor/local/build/programs/server/npm/node_modules/@babel/runtime
