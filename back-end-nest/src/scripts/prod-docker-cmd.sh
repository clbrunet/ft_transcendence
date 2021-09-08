#!/bin/bash

until npm run typeorm:migration:run; do
  sleep 0.1
  echo "PostgreSQL is not ready, retrying..."
done

npm run seed:db

export MODE=PROD

npm run build

npm run start
