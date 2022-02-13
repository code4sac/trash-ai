#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

export PATH="$PATH:/node_modules/.bin:/stack/bin:node_modules/.bin"

cnt=0
wait-for-it.sh -t 300 -h backend -p 4000
cd /stack/frontend
while true; do
    yarn
    nuxt dev
    sleep 30
done
