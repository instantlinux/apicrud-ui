// created 20-may-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title } from 'react-admin';

const apiUrl = process.env.REACT_APP_API_URL;

export const cnfrm = () => {
    return <Card>
      <CardContent>
      <Title title='Confirming contact' />
        <p /><ActionButtons /><p />
      </CardContent>
    </Card>
};

class ActionButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = { uid: null, error: false }
  }
  componentDidMount() {
    const query = window.location.hash.split('?')[1];
    let params = new URLSearchParams(query);
    const token = params.get('token')
    const request = new Request(apiUrl + '/contact/confirm/' + token, {
      method: 'POST'})
    fetch(request)
      .then (response => {
        if (response.status !== 200) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('auth');
          this.setState({ error: true })
        }
        return response.json();
      })
      .then (json => {
	sessionStorage.setItem('token', json.jti);
        sessionStorage.setItem('reset_token', token);
	sessionStorage.setItem('uid', json.sub);
	sessionStorage.setItem('auth', json.auth);
        this.setState({ uid: json.sub, auth: json.auth })
      })
  }
  render() {
    const { uid, auth, error } = this.state;
    if (error) {
      sessionStorage.removeItem('uid');
      return (
        <div style={{textAlign: 'center'}}>
          An expired or invalid token was submitted<p />
          <Button component={Link} variant='contained'
            to='/welcome'>
            Home
           </Button>
        </div>
      )
    }
    return(
       <div>{uid !== undefined &&
         <div>Thank you for confirming your contact information. <br />
          {auth && !auth.match('pending') && <div>
            Manage your contact preferences:<p />
          <div style={{textAlign: 'center' }}>
          <Button component={Link} variant='contained'
            to={{ pathname: '/person/' + uid }}>
            Manage Identity
          </Button>
          </div></div>}
          <p /></div>}
        {auth && auth.match('pending') && <div>
          Set password now, then login to create or update events:</div>}
        <p />
        <div style={{textAlign: 'center' }}>
        {uid !== undefined &&
	 <Button component={Link} variant='contained'
	  to={{ pathname: '/account_password/' + this.state.uid + '/edit' }}>
	  Set Password
	 </Button>}
	<Button component={Link} variant='contained' to='/event'>
	  Login
	</Button>
        </div>
      </div>
    )
  }
}

export default cnfrm;
