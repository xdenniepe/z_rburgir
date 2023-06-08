#!/bin/bash

./mvnw install -DskipTests
cd view/mobile/
npm install --legacy-peer-deps
cd ../../

# export $(cat .env | tr -d ' ' | grep -v "#" | xargs)

# chmod +x ./roboburger-install.sh
# sudo cp ./roboburger-install.sh /usr/local/bin/roboburger-install
# roboburger-install

# RUN npm run build-test (always update this)
# docker run --restart always -d --name roboburger-db -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=RoboBurger@2022!' -p 1433:1433 mcr.microsoft.com/azure-sql-edge