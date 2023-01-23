FROM ubuntu:22.10

# Install nodejs and pnpm
RUN apt-get update -yq \
   && apt-get install curl gnupg -yq \
   && curl -sL https://deb.nodesource.com/setup_16.x | bash \
   && apt-get install nodejs npm -yq \
   && apt-get clean -y

RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
ADD package.json ./
ADD pnpm-workspace.yaml ./

RUN pnpm install

# Bundle app source
COPY . .
RUN pnpm build

CMD pnpm start