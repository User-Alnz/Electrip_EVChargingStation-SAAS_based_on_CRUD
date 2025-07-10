#!/bin/bash
# Load .env file
set -a
source .env
set +a

TARGET=$1

if [ "$TARGET" == "front" ]; then
  echo "🚀 Deploying frontend..."
  rsync -avz -e "ssh -i $DEPLOY_KEY -p $DEPLOY_PORT" ./client/dist "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/client/"
elif [ "$TARGET" == "back" ]; then
  echo "🚀 Deploying backend..."
  rsync -avz -e "ssh -i $DEPLOY_KEY -p $DEPLOY_PORT" ./server/dist "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/server/"
else
  echo "❌ Please specify 'front' or 'back'"
  exit 1
fi