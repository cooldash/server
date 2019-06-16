#!/usr/bin/env bash

DEF_CONF=./deploy/3081_treenity/meteor-client.config.json
CONF=${1:-$DEF_CONF}

if [ ! -f node_modules/meteor-client.js ]; then
    yarn client-bundle $CONF
fi
