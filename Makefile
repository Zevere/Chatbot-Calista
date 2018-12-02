.PHONY: install clean build test docs

install:
	echo 'Installing dependencies...'
	npm ci

clean:
	echo 'Cleaning dist...'
	rm -rfv dist

build:
	touch .env
	docker build --tag zevere/calista .

test:
	npm run coverage

docs:
	npm run docs
	if [ -d "./coverage" ]; then mv coverage docs/coverage; fi
