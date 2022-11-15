// created 2-jan-2021 by rich braun <docker@instantlinux.net>

// TODO this should be a Dialog instead of a separate page
//  react-admin provides no easy way to accomplish that, requires
//  advanced js / material-ui expertise

import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title } from 'react-admin';

class ApikeyGet extends React.Component {
  constructor(props){
    super(props);
    this.state = { data: null }
  }
  componentDidMount(){
    const data = JSON.parse(sessionStorage.getItem('apikey'))
    this.setState(() => ({ data }))
    sessionStorage.removeItem('apikey')
  }
  render() {
    let { data } = this.state
    return <div>{data && data.apikey}</div>
  }
}

const apikeyNew = () => {
  return (
    <Card>
      <Title title="Your new API key" />
      <CardContent>
        <Box color="primary.main" bgcolor="#70ff70" fontFamily="h6.fontFamily"
            p={{ xs: 2, sm: 3, md: 4 }}>
          <ApikeyGet />
        </Box>
        <br /><br />
        Copy this into a secure location - it cannot be displayed again
        <br />
        <Button component={Link} variant='contained'
          to={{ pathname: `/person/${sessionStorage.getItem('uid')}/4` }}>
          Dismiss
        </Button>
      </CardContent>
    </Card>
  );
};

export default apikeyNew;
