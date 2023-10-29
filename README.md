# RTT

## Running the server

Duplicate the example .env file and replace with your credentials:
```shell
cp .env.example .env
vi .env
```

Run the server with node:
```shell
npm start
```

Query the server:
```shell
curl http://localhost:3000/
```

And you'll receive a response like:
```json
{
  "services": [
    {
      "id": "J69364",
      "booked_departure_time": "2152",
      "real_departure_time": "2204",
      "current_location": "Train is between Sturry and Canterbury West",
      "destination": {
        "name": "London Victoria",
        "booked_time": "2322",
        "real_time": "2328"
      }
    },
    {
      "id": "J69355",
      "booked_departure_time": "2158",
      "real_departure_time": "2206",
      "current_location": "Train is between Headcorn and Pluckley",
      "destination": {
        "name": "Ramsgate",
        "booked_time": "2238",
        "real_time": "2245"
      }
    },
    {
      "id": "G29967",
      "booked_departure_time": "2252",
      "real_departure_time": "2252",
      "current_location": "Train is at Ramsgate",
      "destination": {
        "name": "Tonbridge",
        "booked_time": "2336",
        "real_time": "2336"
      }
    }
  ]
}
```
