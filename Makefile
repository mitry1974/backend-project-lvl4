install:
	npm install

lint:
	npx eslint .

test:
	npm run test

test-dev:
	npm run test-dev

start-dev:
	npm run start:dev

start:
	npm run start

start-debug:
	npx webpack-dev-server
	npx nodemon --exec npx babel-node --inspect server/bin/server.js
