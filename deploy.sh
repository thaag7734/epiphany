#!/bin/bash

cwd=$(pwd)
dir=${0%/*}

apt install postgresql || exit

$(dir)/backend/reseed.sh || exit

rm /etc/systemd/user/epiphany.service
ln -s /etc/systemd/user/epiphany.service ./epiphany.service

systemctl daemon-reload
systemctl start epiphany
