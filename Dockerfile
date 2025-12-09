FROM node:18.15.0-slim

WORKDIR /app
ADD . /app
RUN npm i

EXPOSE 8080

ENTRYPOINT ["node", "app.js"]