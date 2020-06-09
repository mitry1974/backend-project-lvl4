install:
	npm install

build:
	npm run build

lint:
	npx eslint .

test:
	npm run test

test-watch:
	npm run test:watch

start-dev:
	npm run start:dev

start:
	npm run start

start-debug:
	npx webpack-dev-server
	npx nodemon --exec npx babel-node --inspect server/bin/server.js

migrations:
	npm run migrations:run

seeds:
	npm run seeds:run
