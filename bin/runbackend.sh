#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

export PATH="$PATH:/node_modules/.bin:/stack/bin"

wait-for-it.sh -t 300 -h bootstrap -p "${BOOTSTRAP_PORT}"
cd /stack/backend
cat << EOF > /tmp/runtime.sh
#!/usr/bin/env bash
pip3 install -r requirements.txt
# serverless offline --printOutput --region us-east-2 --stage local
serverless offline --region us-east-2 --stage local
yarn 
EOF
chmod +x /tmp/runtime.sh
yarn
yarn nodemon -e py,txt -x /tmp/runtime.sh
