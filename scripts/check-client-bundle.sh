#!/usr/bin/env bash

if [ ! -f node_modules/meteor-client.dev.js ]; then
    yarn client-bundle-dev
fi
