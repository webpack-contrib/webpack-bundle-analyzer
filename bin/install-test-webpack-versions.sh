#!/usr/bin/env bash

for dir in "$(dirname "$0")"/../test/webpack-versions/*; do (cd "$dir" && npm i); done
