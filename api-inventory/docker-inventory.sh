#!/bin/bash

# ./mvnw clean -DskipTests package
# docker build -t api-inventory .
# docker tag api-inventory roboburger.azurecr.io/api-inventory
# docker push roboburger.azurecr.io/api-inventory

# M1 - amd64 platform
# ./mvnw clean -DskipTests package
# docker buildx create --use
# docker buildx ls
# docker buildx build --platform linux/amd64 --tag roboburger.azurecr.io/api-inventory --push .
# docker buildx prune --all

# chmod +x ./docker-inventory.sh
# sudo cp ./docker-inventory.sh /usr/local/bin/docker-inventory
# docker-inventory