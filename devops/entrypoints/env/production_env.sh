#!/bin/sh

set -eu

echo "Setting virtual variables..."

echo VITE_API_BASE_URL=$VITE_API_BASE_URL_PRODUCTION >> .env

echo "The variables are set"