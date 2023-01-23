FROM ianwalter/pnpm:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
ADD package.json ./
ADD pnpm-workspace.yaml ./

RUN pnpm install

# Bundle app source
COPY . .
RUN pnpm build
RUN pnpm install --production

EXPOSE 5000
CMD pnpm start