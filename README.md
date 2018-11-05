# Calista
## Manage your tasks on Zevere using Slack.

[![Dependencies]](package.json)
[![Docker Badge]](https://hub.docker.com/r/zevere/chatbot-calista)
[![License]](LICENSE)

| Branch | Status |
| --- | --- |
| Master | [![Build Status Master]](https://travis-ci.org/Zevere/Chatbot-Calista) |
| Develop | [![Build Status Develop]](https://travis-ci.org/Zevere/Chatbot-Calista) |

| Coverage | Status |
| --- | --- |
| Codacy | [![Codacy Badge]](https://www.codacy.com/app/Zevere/Chatbot-Calista?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Zevere/Chatbot-Calista&amp;utm_campaign=Badge_Grade) |


## Table of Contents
- [Calista](#calista)
    - [Manage your tasks on Zevere using Slack.](#manage-your-tasks-on-zevere-using-slack)
    - [Table of Contents](#table-of-contents)
    - [Overview](#overview)
    - [Development](#development)
        - [Install Dependencies](#install-dependencies)
        - [Running in Development](#running-in-development)
        - [Exposing the Application](#exposing-the-application)
    - [Secrets](#secrets)
        - [Mandatory Secrets](#mandatory-secrets)
        - [Optional Secrets](#optional-secrets)
    - [Build Docker Image](#build-docker-image)

## Overview
This app allows users to use Slack as a way to manage their tasks on Zevere. This includes creating tasks
and viewing their task lists. Users will be able to ask the Zevere bot in plain English and get back a
response related to what they want through the usage of [NLP](https://github.com/Zevere/NLP-Python).

## Development
This project makes use of experimental Node.js features. It is recommended you use an IDE or editor that supports linting with the .eslintrc provided. Visual Studio Code is recommended.

### Install Dependencies
Run
```
npm i
``` 
or 
```
make install
```

### Running in Development
To run this app in development, it is best to use the Webpack Dev Server with the nodemon plugin. You may
use it by running `npm run watch`.

### Exposing the Application
To expose the server hosted locally, it is best if you use [LocalTunnel](https://github.com/localtunnel/localtunnel). Opening ports on your computer, router, and port forwarding
is not worth the effort. 

Install LocalTunnel with npm:
```
npm i -g localtunnel
```


Run localtunnel like this:
```
lt --port 8080 --subdomain delicious-velociraptor-88
```

## Secrets
This app contains a swathe of secrets that must be used. They may be loaded through a .env file, or added 
directly to an OS's environment, as well has hosted environments such as Heroku or Travis. Wherever they are
placed, make sure they are accessible at runtime.

### Mandatory Secrets
Below are the mandatory secrets.

```
ZEVERE_SLACK_TOKEN='xoxa-some-really-long-token'
CLIENT_ID='abunchofrandom.numbers'
CLIENT_SECRET='abunchofrandomlettersandnumbers'
SIGNING_SECRET='evenMoreRandomLetters'
DB_CONNECTION_STRING='mongodb://johncena:Cant533th1spa55w0rd@www.yourhost.com:12345/db-name'
VIVID_URL='https://www.somehost.com'
VIVID_USERNAME='foobar'
VIVID_PASSWORD='str0ngpa55w0rd'
```

### Optional Secrets
You may optionally include these other environment variables:

```
APP_LOGS='/logs/calista'
NODE_ENV='development'
```

## Build Docker Image
To build the docker image, run 
```
make build
``` 
or 
```
touch .env && docker build -t zevere/calista .
```
[Build Status Master]: https://travis-ci.org/Zevere/Chatbot-Calista.svg?branch=master
[Build Status Develop]: https://travis-ci.org/Zevere/Chatbot-Calista.svg?branch=develop
[Codacy Badge]: https://api.codacy.com/project/badge/Grade/650d1da005e147e9a2bf61aa6a578bf4
[Dependencies]: https://img.shields.io/david/zevere/chatbot-calista.svg
[Docker Badge]: https://img.shields.io/docker/pulls/zevere/chatbot-calista.svg
[License]: https://img.shields.io/github/license/zevere/chatbot-calista.svg
