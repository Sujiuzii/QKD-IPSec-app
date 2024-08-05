FROM node:12

COPY . /app

WORKDIR /app

RUN npm install && \
    npm run build

CMD [ "npm run start" ]