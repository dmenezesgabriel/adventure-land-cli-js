# Adventure Land CLI

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=dmenezesgabriel_adventure-land-cli-js&metric=bugs)](https://sonarcloud.io/dashboard?id=dmenezesgabriel_adventure-land-cli-js)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=dmenezesgabriel_adventure-land-cli-js&metric=code_smells)](https://sonarcloud.io/dashboard?id=dmenezesgabriel_adventure-land-cli-js)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=dmenezesgabriel_adventure-land-cli-js&metric=coverage)](https://sonarcloud.io/dashboard?id=dmenezesgabriel_adventure-land-cli-js)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=dmenezesgabriel_adventure-land-cli-js&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=dmenezesgabriel_adventure-land-cli-js)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=dmenezesgabriel_adventure-land-cli-js&metric=ncloc)](https://sonarcloud.io/dashboard?id=dmenezesgabriel_adventure-land-cli-js)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=dmenezesgabriel_adventure-land-cli-js&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=dmenezesgabriel_adventure-land-cli-js)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dmenezesgabriel_adventure-land-cli-js&metric=alert_status)](https://sonarcloud.io/dashboard?id=dmenezesgabriel_adventure-land-cli-js)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=dmenezesgabriel_adventure-land-cli-js&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=dmenezesgabriel_adventure-land-cli-js)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=dmenezesgabriel_adventure-land-cli-js&metric=security_rating)](https://sonarcloud.io/dashboard?id=dmenezesgabriel_adventure-land-cli-js)

Adventure Lands characters automation via command line interface.

## Requirements

- Docker
- Docker Compose
- Makefile

## Usage

**build**:

services:

- puppetter-emulator :rocket: _Good to go!_
- socket-client :warning: _under development_

```sh
make build-<service name>
```

### Browser emulators

Deploy the selected characters and run the `CODE` saved at main slot.

1. **Credentials**: Create a `.env` file and place at root folder containing the variables:

```env
LOGIN="your_adventure_land_login"
PASSWORD="your_adventure_land_password"
# Server to deploy character ex: EUII
TARGET_SERVER_IDENTIFICATOR="target_server_identificator"
# Character names
CHARACTERS="CharName CharName"
# CODE path
MAIN_CODE_PATH="/usr/src/app/CODE/code.js"

```

| :exclamation: This is very important |
| ------------------------------------ |

`CHARACTERS` must be separated by spaces.

2. **run**:

```sh
make run-<service-name>
```

## Related links

- [My unofficial guide repository](https://github.com/dmenezesgabriel/adventure-land-journey)
