#!/bin/sh -e
cd /usr/share/nginx/html
cat <<EOF >.env
# TODO this doesn't yet work, see
#   https://www.freecodecamp.org/news/how-to-implement-runtime-environment-variables-with-create-react-app-docker-and-nginx-7f9d42a91d70/
REACT_APP_API_URL=$REACT_APP_API_URL
REACT_APP_MEDIA_URL=$REACT_APP_MEDIA_URL
REACT_APP_TOKEN_MAPBOX=$REACT_APP_TOKEN_MAPBOX
EOF

nginx -g "daemon off;"
