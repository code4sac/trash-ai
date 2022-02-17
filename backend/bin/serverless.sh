#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

default_stage="$(git rev-parse --abbrev-ref HEAD)"
profile="${1-}"
shift
test -n "${profile}" || { echo "Usage: $0 <aws profile> [stage [default: git branch]] <args>"; exit 1; }
stage="${2:-$default_stage}"

cmd="serverless -s ${stage} --aws-profile ${profile} $*"
echo "Executing: ${cmd}"
eval "${cmd}"
