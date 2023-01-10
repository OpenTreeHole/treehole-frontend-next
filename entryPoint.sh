#!/bin/bash

set -xe
: "${VITE_BACKEND_URL?Need VITE_BACKEND_URL}"

set -xe
: "${VITE_AUTH_URL?Need VITE_AUTH_URL}"

set -xe
: "${VITE_AUTH_BASE_URL?Need VITE_AUTH_BASE_URL}"

set -xe
: "${VITE_COOKIE_DOMAIN?Need VITE_COOKIE_DOMAIN}"

for file in /usr/share/nginx/html/assets/*;
do
  if [[ -f $file ]]; then
    sed -i "s|VITE_BACKEND_URL_REPLACE|$VITE_BACKEND_URL|g" $file
    sed -i "s|VITE_AUTH_URL_REPLACE|$VITE_AUTH_URL|g" $file
    sed -i "s|VITE_AUTH_BASE_URL_REPLACE|$VITE_AUTH_BASE_URL|g" $file
    sed -i "s|VITE_COOKIE_DOMAIN_REPLACE|$VITE_COOKIE_DOMAIN|g" $file
  fi
done

for file in /usr/share/nginx/html/*;
do
  if [[ -f $file ]]; then
    sed -i "s|VITE_BACKEND_URL_REPLACE|$VITE_BACKEND_URL|g" $file
    sed -i "s|VITE_AUTH_URL_REPLACE|$VITE_AUTH_URL|g" $file
    sed -i "s|VITE_AUTH_BASE_URL_REPLACE|$VITE_AUTH_BASE_URL|g" $file
    sed -i "s|VITE_COOKIE_DOMAIN_REPLACE|$VITE_COOKIE_DOMAIN|g" $file
  fi
done

exec "$@"