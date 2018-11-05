#!/bin/sh
VERSION=$(cat package.json | jq '.version' | sed -e 's/\"//g')
NAME=$(cat package.json | jq '.name' | sed -e 's/\"//g')
docker run -p 10100:3000 -it --rm --env ENV_RUN=DEV m2msolutions-docker.jfrog.io/$NAME:$VERSION
