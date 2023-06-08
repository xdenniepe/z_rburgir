# build environment
FROM node:16-alpine3.12 as build
WORKDIR /app

COPY package.json .
RUN npm install
COPY . .
RUN npm run build 

# production environment
FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80