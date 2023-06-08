#!/bin/bash

# ./mvnw clean -DskipTests package
# docker build -t api-auth .
# docker tag api-auth roboburger.azurecr.io/api-auth
# docker push roboburger.azurecr.io/api-auth

# M1 - amd64 platform
# ./mvnw clean -DskipTests package
# docker buildx create --use
# docker buildx ls
# docker buildx build --platform linux/amd64 --tag roboburger.azurecr.io/api-auth --push .
# docker buildx prune --all

# chmod +x ./docker-auth.sh
# sudo cp ./docker-auth.sh /usr/local/bin/docker-auth
# docker-auth