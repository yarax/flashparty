# Flash party app backend

## Installation 

```
docker-compose up
```

## Usage

Swagger UI

http://localhost:3000/docs

## Endpoints

`POST /spots` - creates or updates user's location. Could be send periodically from client app with current location.

`GET /party/:coordinates` - checks the possibility to create a party around given coordinates. If number of possible participants is less than 5 - sends the error back, otherwise creates a party and sends back details

`DELETE /spots` -  deletes user's location data from system
