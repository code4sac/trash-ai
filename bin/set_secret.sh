#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

test "${REGION}" || { echo "REGION is not set"; exit 1; }
test "${BASIC_USERNAME:-}" || { echo "BASIC_USERNAME is not set"; exit 1; }
test "${BASIC_PASSWORD:-}" || { echo "BASIC_PASSWORD is not set"; exit 1; }

secret_name="trash-ai/${REGION}/secret"
aws sts get-caller-identity || { echo "Auth is not set"; exit 1; }

output=$(aws secretsmanager get-secret-value --secret-id "${secret_name}" 2>&1 || true)
proceed=false
## Match ResourceNotFoundException
if [[ "${output}" =~ "ResourceNotFoundException" ]]; then
    echo "Secret ${secret_name} doesn't exist"
    proceed=true
fi
echo "OUTPUT: ${output}"

if [[ "${proceed}" != "true" ]]; then
    echo "Secret ${secret_name} exists"
    exit 0
fi

echo "Secret ${secret_name} not found"
echo "creating secret ${secret_name}"

SECRET_STRING="$(cat <<EOF
{
  "BASIC_USERNAME": "${BASIC_USERNAME}",
  "BASIC_PASSWORD": "${BASIC_PASSWORD}"
}
EOF
)"
aws secretsmanager create-secret  \
    --name "${secret_name}" \
    --secret-string "${SECRET_STRING}"
