install:
	npm install

lint:
	npx eslint .

test:
	npm run test

test-dev:
	npm run test-dev

start:
	heroku local -f Procfile.dev

start-backend:
	npx nodemon --exec npx babel-node server/bin/server.js

start-frontend:
	npx webpack-dev-server

start-debug:
	npx webpack-dev-server
	npx nodemon --exec npx babel-node --inspect server/bin/server.js
