// created 26-apr-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title } from 'react-admin';

import { apiUrl } from '../lib/constants';

class VersionInfo extends React.Component {
  constructor(props){
    super(props);
    this.state = { data: null }
  }
  componentDidMount(){
    fetch(apiUrl + '/health')
      .then(response => response.json())
      .then(data => this.setState({
        version: data.version,
        build_date: data.notes[0],
      }))
  }
  render() {
    const { version, releaseId, build_date } = this.state
    return(
      <div><i>Version: {version}-{releaseId && releaseId.substring(0,7)} &bull;
        Built: {build_date && build_date.split("date:")[1]}</i></div>
    )
  }
}

const aboutPage = () => (
    <Card>
	<Title title="About apicrud UI Example" />
	<CardContent>
	This framework was created to make it far easier to get started on full-stack development of REST-based services ranging from a simple CLI wrapper for queries of local APIs to full web-scale consumer-facing applications.
	<p />
	The essential components of a modern full-stack application include a back-end API server, a front-end UI server, a database, a memory-cache and a background worker for performing actions such as emailing, photo uploading or report generation.
	<p />
	The rise of Docker and Kubernetes starting around 2017 made it possible to set up these production-grade services directly on the laptop of any developer. Only recently have the tools been easier to configure and set up. This framework provides working example code you can use to get started creating your own secure, web-scale services.
	<p />
	Implementation/design includes these technologies: <a href="http://www.celeryproject.org/">celery</a>, <a href="https://aws.amazon.com/cloudfront/">CloudFront and S3</a>, <a href="https://www.docker.com/">docker</a>, <a href="http://flask.pocoo.org/">flask</a>, <a href="https://kubernetes.io/">kubernetes</a>, <a href="https://developer.mapquest.com/documentation/open/geocoding-api/">MapQuest geocoding</a>, <a href="https://www.mapbox.com/">mapbox</a>, <a href="https://mariadb.org/">MariaDB</a>, <a href="https://docs.python.org/3/">python 3</a>, <a href="https://www.rabbitmq.com/">RabbitMQ</a>, <a href="https://reactjs.org">react.js</a>, <a href="https://marmelab.com/react-admin">react-admin</a>, <a href="https://www.sqlalchemy.org/">sqlalchemy</a>, <a href="https://uwsgi-docs.readthedocs.io/en/latest/">uWSGI</a>.
	<p />
        Software copyright &copy; 2020 by Richard Braun &bull; <a href="https://www.apache.org/licenses/LICENSE-2.0">Apache 2.0</a> license <p />
        <VersionInfo />
        </CardContent>
    </Card>
);
export default aboutPage;
