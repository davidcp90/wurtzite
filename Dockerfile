FROM node:8.11.1

RUN mkdir -p /var/www
RUN apt-get update
RUN apt-get install -y nginx
COPY nginx/nginx-app.conf /etc/nginx/sites-enabled/default
COPY . /var/www
WORKDIR /var/www
RUN npm install --production

EXPOSE 8080
EXPOSE 80

