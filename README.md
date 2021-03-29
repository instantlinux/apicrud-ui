## apicrud-ui
[![](https://img.shields.io/npm/v/apicrud-ui.svg)](https://npmjs.org/package/apicrud-ui) [![](https://images.microbadger.com/badges/image/instantlinux/apicrud-ui.svg)](https://microbadger.com/images/instantlinux/apicrud-ui "Image badge") [![](https://images.microbadger.com/badges/commit/instantlinux/apicrud-ui.svg)](https://microbadger.com/images/instantlinux/apicrud-ui "Commit badge") [![](https://gitlab.com/instantlinux/apicrud-ui/badges/master/pipeline.svg)](https://gitlab.com/instantlinux/apicrud-ui/pipelines "pipelines") [![](https://gitlab.com/instantlinux/apicrud-ui/badges/master/coverage.svg)](https://gitlab.com/instantlinux/apicrud-ui/-/jobs/artifacts/master/file/coverage/lcov-report/index.html?job=analysis "coverage") ![](https://img.shields.io/badge/platform-amd64%20arm64%20arm%2Fv6%20arm%2Fv7-blue "Platform badge") [![](https://img.shields.io/badge/dockerfile-latest-blue)](https://gitlab.com/instantlinux/apicrud-ui/-/blob/master/Dockerfile.ui "dockerfile")


### What is this

Skip the python/React.js learning curve and put your ideas in production!

The _apicrud_ framework was created to make it far easier to get started on full-stack development of REST-based services ranging from a simple CLI wrapper for queries of local APIs to full web-scale consumer-facing applications.

The essential components of a modern full-stack application include a back-end API server, a front-end UI server, a database, a memory-cache and a background worker for performing actions such as emailing, photo uploading or report generation. This is the UI front-end.

### Usage

Clone this repo to your local environment. To start this UI service in a shell session (on a Linux or Mac laptop):

* Clone the [instantlinux/apicrud](https://github/instantlinux/apicrud) repo to a separate directory and follow the instructions given in its README to start the back-end.
* Set environment variables as defined below, at least `REACT_APP_API_URL`.
* Invoke `make ui_local` to bring up the UI, and access by the URL http://localhost:3000.
* Initial login for `admin` for a newly created database is `p@ssw0rd`.

Documentation for the API, defined in openapi.yaml in the instantlinux/apicrud application example (swagger format), can be viewed through the UI as http://localhost:8080/api/v1/ui.

### Environment variables

Variable | Default | Description
-------- | ------- | -----------
PORT | 3000 | Port to listen on
REACT_APP_API_URL | http://localhost:32080 | Backend, e.g. https://api.yours.com:8080/api/v1
REACT_APP_TOKEN_MAPBOX | | API key for location map (see [mapbox.com](https://account.mapbox.com/auth/signup))

TODO: the published docker image won't read these values at startup until the implementation of [env-config.js](https://www.freecodecamp.org/news/how-to-implement-runtime-environment-variables-with-create-react-app-docker-and-nginx-7f9d42a91d70/) is completed.

### Background

The rise of Docker and Kubernetes starting around 2017 made it possible to set up these production-grade services directly on the laptop of any developer. Only recently have the tools been easier to configure and set up. This framework provides working example code you can use to get started creating your own secure, web-scale services.

Implementation/design includes these technologies: <a href="http://www.celeryproject.org/">celery</a>, <a href="https://aws.amazon.com/cloudfront/">CloudFront and S3</a>, <a href="https://www.docker.com/">docker</a>, <a href="http://flask.pocoo.org/">flask</a>, <a href="https://kubernetes.io/">kubernetes</a>, <a href="https://developer.mapquest.com/documentation/open/geocoding-api/">MapQuest geocoding</a>, <a href="https://www.mapbox.com/">mapbox</a>, <a href="https://mariadb.org/">MariaDB</a>, <a href="https://docs.python.org/3/">python 3</a>, <a href="https://www.rabbitmq.com/">RabbitMQ</a>, <a href="https://reactjs.org">react.js</a>, <a href="https://marmelab.com/react-admin">react-admin</a>, <a href="https://www.sqlalchemy.org/">sqlalchemy</a>, <a href="https://uwsgi-docs.readthedocs.io/en/latest/">uWSGI</a>.

### Contributions

Your pull-requests and bug-reports are welcome here. See [CONTRIBUTING.md](CONTRIBUTING.md).

### License

Software copyright &copy; 2021 by Richard Braun &bull; <a href="https://www.apache.org/licenses/LICENSE-2.0">Apache 2.0</a> license <p />
