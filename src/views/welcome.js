// created 20-may-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title } from 'react-admin';
import queryString from 'query-string';

const welcome = () => {
    const search = window.location.hash.split('?');
    var buttons = null;
    if (search.length > 1) {
      const query = queryString.parse(search[1]);
      buttons = 'buttons' in query && query.buttons;
      if (buttons && buttons.includes('login')) {
        // Came here from accountPassword reset: logout
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('uid');
      }
    }
    const uid = sessionStorage.getItem('uid')
    const auth = sessionStorage.getItem('auth');
    return <Card>
        <Title title="Example" />
        <CardContent>
        This is an example message-board application with a python REST backend and a React frontend. You can build your own full-stack applications by adding new schema and logic to the models, views and controllers. Make them secure by customizing the RBAC and privacy features of instantlinux/apicrud.
        {(!uid || (buttons && buttons.includes('login'))) && <div>
           <p />
           <div style={{textAlign: 'center' }}><LoginButton /> <ForgotPWButton />
           </div></div>}
          {uid !== null && auth && auth.match(/pwchange/) &&
           <div style={{textAlign: 'center' }}>
	     <Button component={Link} variant='contained'
	      to={{ pathname: '/account_password/' + uid + '/edit' }}>
	      Set Password
	     </Button>
           </div>}
          <p />
          {uid === null && <div>
	    You do not need an account to respond to invitations. If you received
	    a link by email, SMS or another contact method, click on that link.
	    <p />
	    With an account, you can create lists and invite people to them.
           </div>}
        </CardContent>
    </Card>
};

const LoginButton = () => (
    <Button component={Link} variant='contained' to='/login'>
        Login
    </Button>
);

const ForgotPWButton = () => (
    <Button component={Link} variant='contained'
        to='/account/create?forgot=true'>
        Forgot Password
    </Button>
);

export default welcome;
