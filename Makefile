.PHONY: install clean build test

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
	npm test
