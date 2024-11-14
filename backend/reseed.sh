#!/bin/bash

cwd=$(pwd)
dir=${0%/*}

cd "$dir" || exit

source ./.venv/bin/activate
rm -r ./instance 2>/dev/null

# create tables
echo '===== Creating tables ====='
echo ''
{ flask db upgrade e88bf513bb93 && echo '===== Tables created successfully ====='; } || { echo '!!!!! Failed to create tables !!!!!' && exit; }

echo ''

echo '===== Creating FOREIGN KEY relationships ====='
echo ''
{ flask db upgrade 040ad73cbf6c && echo '===== Relationships created successfully ====='; } || { echo '!!!!! Failed to create relationships !!!!!' && exit; }

echo ''
echo 'Done!'

cd "$cwd" || exit
