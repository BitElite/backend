FROM node:16-alpine
WORKDIR /src
COPY package.json /src/package.json
RUN npm install
COPY tsconfig.json /src/tsconfig.json

COPY src src
CMD ["npm", "run", "start"]