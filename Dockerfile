FROM node:14.16.0
COPY . /var/www/node
WORKDIR /var/www/node
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]