# mongo-multitenancy-express
Example of mongoose + express + database level multitenancy

### POST /add
JSON to add a new user

{"user": {"username": "murilo", "email": "murilo@test.com", "password": "123456"} }


### POST /addclient
JSON to add a new client

{"client": {"name": "mothsin", "client_db": "mothsin_inc", "active": true} }
