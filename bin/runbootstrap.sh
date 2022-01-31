#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

banner() {
  echo "***************************************************"
  echo "* $*"
  echo "***************************************************"
}

export PATH="$PATH:/node_modules/.bin:/stack/bin"
export AWS_PROFILE="localstack"
export TIMEOUT=60

banner "Waiting for localstack to start"
wait-for-it.sh -t ${TIMEOUT} -h localstack -p 4566
banner "Starting Bootstrap..."

banner "Credentials set"
cat ~/.aws/credentials

cd /stack/infra
banner "Bootstrapping $(pwd)"
cdklocal bootstrap
cdklocal deploy trash-ai-global
cdklocal deploy trash-ai-us-east-2-region

banner "Starting ready listener @ port ${BOOTSTRAP_PORT}"
python3 -m http.server ${BOOTSTRAP_PORT}
