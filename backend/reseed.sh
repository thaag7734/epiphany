#!/bin/bash
cwd=$(pwd)
dir=${0%/*}

cd "$dir" || exit

source ./.venv/bin/activate
source .env

SQLALCHEMY_DATABASE_URI=$DATABASE_URL

if [[ $SQLALCHEMY_DATABASE_URI == postgres* ]]; then
  echo '===== Postgres detected, dropping schema ====='
  echo ''
  { psql "$SQLALCHEMY_DATABASE_URI" -c 'DROP SCHEMA epiphany CASCADE;' && echo '' && echo '===== Schema dropped successfully ====='; } || { echo '' && echo '!!!!! Failed to drop schema !!!!!' && exit 1; }
else
  echo '===== Sqlite detected, deleting instance folder ====='
  echo ''
  { rm -r ./instance 2>/dev/null; }
  echo ''
  echo '===== Instance folder deleted ====='
fi

# Create tables
echo '===== Creating tables ====='
echo ''
{ flask db upgrade e88bf513bb93 && echo '' && echo '===== Tables created successfully ====='; } || { echo '' && echo '!!!!! Failed to create tables !!!!!' && exit 1; }

echo ''

if [[ $SQLALCHEMY_DATABASE_URI == sqlite* ]]; then
  echo '----- Sqlite detected, skipping foreign keys -----'
else
  echo '===== Creating FOREIGN KEY relationships ====='
  echo ''
  { flask db upgrade 040ad73cbf6c && echo '===== Relationships created successfully ====='; } || { echo '' && echo '!!!!! Failed to create relationships !!!!!' && exit 1; }
fi

echo ''

echo '===== Seeding ====='
echo ''
{ flask seed all && echo '===== Seeded successfully ====='; } || { echo '' && echo '!!!!! Failed to seed !!!!!' && exit 1; }

echo ''
echo 'Done!'

cd "$cwd" || exit
