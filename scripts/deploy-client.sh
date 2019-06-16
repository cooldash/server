#!/usr/bin/env bash

set -e

# read full path for dir
function rp() {
  perl -MCwd -le 'print Cwd::abs_path(shift)' "$1"
}
# get exported var from JS Mup file
function get_mup_env() {
  pushd $DIR > /dev/null
  node -e "process.stdout.write(require('./mup.js').$1)"
  popd > /dev/null
}

DIR=`rp $(dirname $0)`
cd $DIR/../..

# get vars from mup
DOMAIN=`get_mup_env app.env.ROOT_URL`
NAME=`get_mup_env app.name`
HOST=`get_mup_env servers.one.host`
USER=`get_mup_env servers.one.username`

WWW="$USER@$HOST:/var/www/$NAME"
CONF=$DIR/meteor-client.config.json

cp meteor-client.config.json $CONF
sed -i '' -e "s%http:\\/\\/localhost:3070%$DOMAIN%g" $CONF

#rm node_modules/meteor-client.js
rm -rf ./build
# build client meteor bundle
npx meteor-client bundle -c $CONF
GENERATE_SOURCEMAP=false node client-build/scripts/build.js

# upload to server
echo "Syncing react client build to $WWW"
rsync -avzhe ssh --delete --progress ./build/* $WWW
