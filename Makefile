.PHONY: install clean build deploy

install:
	echo 'Installing dependencies...'
	npm i

clean:
	echo 'Cleaning dist...'
	rm -rf dist

build:
	touch .env
	docker build -t zevere/calista .

deploy:
	echo 'Deploying to Heroku...'
	echo 'Deploy script not configured. Passing.'
