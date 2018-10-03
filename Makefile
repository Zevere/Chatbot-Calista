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
	echo 'Deploy script not configured. Passing.'
	# NEEDS FIX: Heroku CLI might not be a good option for CI
	# heroku login
	# heroku container:login
	# heroku container:push web -a calista-release
	# heroku container:release web -a calista-release
