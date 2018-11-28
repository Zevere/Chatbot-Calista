.PHONY: install clean build deploy

install:
	echo 'Installing dependencies...'
	npm ci

clean:
	echo 'Cleaning dist...'
	rm -rfv dist

build:
	touch .env
	docker build --tag zevere/calista .
