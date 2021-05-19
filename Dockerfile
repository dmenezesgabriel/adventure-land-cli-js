FROM zenika/alpine-chrome:with-puppeteer

# Install app dependencies
# Different workdir from copy all to not overwrite installed modules
COPY package*.json .
RUN yarn install

WORKDIR /usr/src/app

# Bundle app source
COPY . .
