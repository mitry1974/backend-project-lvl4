install:
	npm install

db-setup:
	make migrations && make seeds

freshdb:
	rm -rf ./db.sqlite && NODE_ENV=development make db-setup

build:
	npm run build

lint:
	npx eslint .

test:
	npm run test

test-coverage:
	npm run test-coverage

test-watch:
	npm run test:watch

start-dev:
	npm run start:dev

debug:
	npm run start:dev:inspect

start:
	npm run start

migrations:
	npm run migrations:run

seeds:
	npm run seeds:run
