#!/usr/bin/env bash

mkdir -p ./public/ant
rm -rf ./public/ant/icons
cp -r './node_modules/@ant-design/icons/svg' ./public/ant/icons
