# Calista
## Manage your tasks on Zevere using Slack.

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