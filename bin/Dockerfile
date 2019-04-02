FROM node:10.15.3

RUN mkdir -p /var/www
COPY ./dist /var/www
WORKDIR /var/www
RUN npm install