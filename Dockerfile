from node:18.2.0-alpine3.14

WORKDIR /app
COPY ./src/package.json /app/package.json
RUN npm install

COPY ./bin/ /app/bin/
COPY ./src/000.js /app/app.js

EXPOSE 3000
CMD ["node", "app.js"]
