# Calista
## Manage your tasks on Zevere using Slack.

[![Dependencies]](package.json)
[![Docker Badge]](https://hub.docker.com/r/zevere/chatbot-calista)
[![License]](LICENSE)

| Branch | Status |
| --- | --- |
| Master | [![Build Status](https://travis-ci.org/Zevere/Chatbot-Calista.svg?branch=master)](https://travis-ci.org/Zevere/Chatbot-Calista) |
| Develop | [![Build Status](https://travis-ci.org/Zevere/Chatbot-Calista.svg?branch=develop)](https://travis-ci.org/Zevere/Chatbot-Calista) |

| Coverage | Status |
| --- | --- |
| Codacy | [![Codacy Badge](https://api.codacy.com/project/badge/Grade/650d1da005e147e9a2bf61aa6a578bf4)](https://www.codacy.com/app/Zevere/Chatbot-Calista?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Zevere/Chatbot-Calista&amp;utm_campaign=Badge_Grade) |


### Table of Contents
1. [Development](#development)

## Development
This project makes use of experimental Node.js features. It is recommended you use an IDE or editor that supports linting with the .eslintrc provided. Visual Studio Code is recommended.

## Secrets
Secrets may be added by using a .env file placed in the project directory. the .env should look something like:

```
ZEVERE_SLACK_TOKEN='xoxa-some-really-long-token'
CLIENT_ID='abunchofrandom.numbers'
CLIENT_SECRET='abunchofrandomlettersandnumbers'
```

You may optionally include other environment variables such as the app log directory path:

```
APP_LOGS='/logs/calista'
```

[Docker Badge]: https://img.shields.io/docker/pulls/zevere/chatbot-calista.svg
[License]: https://img.shields.io/github/license/zevere/chatbot-calista.svg
[Dependencies]: https://img.shields.io/david/zevere/chatbot-calista.svg