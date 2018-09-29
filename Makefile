.PHONY: install clean build deploy

install:
	echo 'Installing dependencies...'
	npm run install

clean:
	rm -rf lib

build:
	docker build -t zevere/calista .

deploy:
	echo "$$DOCKER_PASSWORD" | docker login -u "$$DOCKER_USERNAME" --password-stdin