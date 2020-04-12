FROM node:12.16.2-alpine as node-dep
MAINTAINER Rich Braun "docker@instantlinux.net"
ARG BUILD_DATE
ARG VCS_REF
LABEL org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.license=Apache-2.0 \
    org.label-schema.name=apicrud-ui \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.vcs-url=https://github.com/instantlinux/apicrud-ui
WORKDIR /app

# TODO figure out how to read this as a startup env var
#  right now it has to be hardcoded at build time
ARG REACT_APP_API_URL=https://example-dev.ci.net/api/v1
ARG REACT_APP_TOKEN_MAPBOX=must-be-set
ARG REACT_APP_MEDIA_URL=https://example-media-dev.ci.net/api/v1
ENV REACT_APP_MEDIA_URL=$REACT_APP_MEDIA_URL \
    REACT_APP_TOKEN_MAPBOX=$REACT_APP_TOKEN_MAPBOX

COPY package.json yarn.lock ./
RUN yarn
COPY public/ ./public
COPY src/ ./src
RUN yarn build

FROM nginx:1.17.9-alpine
COPY --from=node-dep /app/build /usr/share/nginx/html
# When in doubt about dependencies, yarn.lock documents them
COPY yarn.lock /root/

COPY entrypoint.sh /usr/local/bin/
EXPOSE 80
CMD ["/usr/local/bin/entrypoint.sh"]
