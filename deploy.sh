#!/bin/bash

set -ev
set -o pipefail

# Set tag to latest or unstable based on type of build
tag=${1:+latest}
tag=${tag:-unstable}

# Publish the docker image to Artifactory
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin https://${DOCKER_REGISTRY_URL}
docker tag ibmblockchain/fabric-api-server ${DOCKER_REGISTRY_URL}ibmblockchain/fabric-api-server:${tag}
docker push ${DOCKER_REGISTRY_URL}ibmblockchain/fabric-api-server:${tag}