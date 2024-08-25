#!/bin/bash

./mvnw install -DskipTests
cd view/mobile/
npm install --legacy-peer-deps
cd ../../

# export $(cat .env | tr -d ' ' | grep -v "#" | xargs)

# chmod +x ./burgerman-install.sh
# sudo cp ./burgerman-install.sh /usr/local/bin/burgerman-install
# burgerman-install

# RUN npm run build-test (always update this)
# docker run --restart always -d --name burgerman-db -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=burgerman@2022!' -p 1433:1433 mcr.microsoft.com/azure-sql-edge
