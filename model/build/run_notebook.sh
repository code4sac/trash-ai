#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

mkdir -p ~/.kaggle
test -f ~/.kaggle/kaggle.json || {
    echo "Kaggle API key not found. Please login and download api key and put it in ~/.kaggle/kaggle.json"
    exit 1
}
chmod 600 ~/.kaggle/kaggle.json

docker-compose up --build
./name_map.py
