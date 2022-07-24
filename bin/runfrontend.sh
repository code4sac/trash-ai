#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

export PATH="$PATH:/node_modules/.bin:/stack/bin:node_modules/.bin"

wait-for-it.sh -t 300 -h backend -p 4000
cd /stack/frontend
while true; do
    yarn
    yarn dev --port 5150 --host 0.0.0.0
    sleep 30
done
