#!/usr/bin/env bash

set -e
# cd `dirname $0`

if [ -z "$2" ]; then
    CMD=deploy
else
    CMD="$2"
fi

DIR=`find ./deploy -type d -depth 1 -name "*$1*"`

if [ -d "$DIR" ]; then
    echo "found $DIR"

    if [ "$CMD" = "deploy" -a -f "$DIR/deploy.sh" ]; then
        "$DIR/deploy.sh"
    fi

    cd "$DIR"
    mup $CMD "$3" "$4" "$5" "$6"
    exit
else
    echo "not found $1 for deploy"
    exit 1
fi
