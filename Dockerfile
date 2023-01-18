FROM node:16

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN pnpm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "pnpm", "dev" ]