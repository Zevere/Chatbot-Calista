.PHONY: install clean build deploy

install:
	echo 'Installing dependencies...'
	npm i

clean:
	echo 'Cleaning dist...'
	rm -rf dist

build:
	docker build -t zevere/calista .

deploy:
	echo "$$DOCKER_PASSWORD" | docker login -u "$$DOCKER_USERNAME" --password-stdin