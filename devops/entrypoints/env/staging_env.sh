#!/bin/sh

set -eu

echo "Setting virtual variables..."

echo VITE_API_BASE_URL=$VITE_API_BASE_URL_STAGING >> .env

echo "The variables are set"