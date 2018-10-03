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
	echo "$$HEROKU_KEY" | docker login -u "$$HEROKU_USER" --password-stdin registry.heroku.com
	heroku container:login
	heroku container:push web -a calista-release
	heroku container:release web -a calista-release
