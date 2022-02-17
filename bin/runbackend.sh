#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

export PATH="$PATH:/node_modules/.bin:/stack/bin"

wait-for-it.sh -t 300 -h bootstrap -p ${BOOTSTRAP_PORT}
cd /stack/backend
yarn
yarn run start
