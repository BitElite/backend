# BitElite Backend

## Install node.js

```bash
# add PPA from NodeSource
curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh

# call the install script
. nodesource_setup.sh

# install node.js
apt-get install -y nodejs

# check the version
node -v
```

## Instructions to setup

1. git clone https://github.com/BitElite/backend.git
2. npm install
3. create .env file
4. Copy contents on .env-example to .env file
5. npm run start
