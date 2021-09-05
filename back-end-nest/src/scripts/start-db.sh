#!/bin/bash

SERVER="my_database_server";
PW="mysecretpassword";
DB="my_database";

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
  docker run --name $SERVER -e POSTGRES_PASSWORD=$PW \
  -e PGPASSWORD=$PW \
  -p 5436:5432 \
  -d postgres

# create the db 
until echo "CREATE DATABASE $DB ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres &> /dev/null; do
  sleep 0.2
done
until echo "\list" | docker exec -i $SERVER psql -U postgres; do
  sleep 0.2
done
