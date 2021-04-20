# Adventure Land CLI

Adventure Lands characters automation via command line interface.

## Requirements

- Docker
- Docker Compose
- Makefile

## Usage

**build**:

```sh
make build
```

### Socket client

| :warning: WARNING |
| :---------------- |

Under construction

### Browser emulator

Deploy the selected characters and run the `CODE` saved at main slot.

1. **Credentials**: Create a `.env` file and place at root folder containing the variables:

```env
EMAIL=your_account_email
PASSWORD=your_account_password
# DEBUG=pw:api
CHARACTERS="CharacterName CharacterName"
```

| :exclamation: This is very important |
| ------------------------------------ |

`CHARACTERS` must be separated by spaces.

2. **run**:

```sh
make emulator
```

## Related links

- [My unofficial guide repository](https://github.com/dmenezesgabriel/adventure-land-journey)
