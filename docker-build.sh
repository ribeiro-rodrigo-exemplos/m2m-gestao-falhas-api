#!/bin/sh
VERSION=$(cat package.json | jq '.version' | sed -e 's/\"//g')
NAME=$(cat package.json | jq '.name' | sed -e 's/\"//g')
docker build --rm -t m2msolutions-docker.jfrog.io/$NAME:$VERSION .
