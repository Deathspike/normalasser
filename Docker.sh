#!/bin/sh
PGID=${PGID:-1000}
PUID=${PUID:-1000}
groupmod -g $PGID node > /dev/null 2>&1
usermod -d /config -u $PUID node > /dev/null 2>&1
mkdir -p /config && chown node /config && chmod 755 /config
su-exec node "$@"
