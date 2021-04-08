// created 7-apr-2021 by rich braun <docker@instantlinux.net>

// TODO this should be a Dialog instead of a separate page

import React from 'react';
import { maxLength, minLength, required, useSafeSetState,
         useTranslate } from 'react-admin';
import { useNotify } from 'ra-core';
import { Field, Form } from 'react-final-form';
import { Link, useHistory } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent,
         Switch, TextField, makeStyles } from '@material-ui/core'
import { Title } from 'react-admin';
import { QRCode } from 'react-qr-svg';

import { apiUrl } from '../lib/constants';

class MFAGenerate extends React.Component {
  constructor(props){
    super(props);
    this.state = { data: null }
  }
  componentDidMount(){
    const uid = sessionStorage.getItem('uid');
    const token = sessionStorage.getItem('token');
    const request = new Request(apiUrl + '/auth_totp', {
        headers: new Headers({
          Accept: 'application/json',
          Authorization: 'Basic ' + btoa(uid + ':' + token),
          mode: 'no-cors'})
    })
    // TODO handle errors
    fetch(request)
      .then (response => response.json())
      .then (data => this.setState({
        uri: data.uri,
        nonce: data.jti,
      }))
  }
  render() {
    const { nonce, uri } = this.state
    sessionStorage.setItem('nonce', nonce);
    if (uri) {
        return(
            <div>Scan this QR code on your authenticator app<p />
            <QRCode value={uri} style={{ width: 192 }} /></div>
        )
    } else {
        return ''
    }
  }
}

const useStyles = makeStyles(
    (theme) => ({
        button: {
            width: '100%',
            marginTop: theme.spacing(1),
        },
        icon: {
            marginRight: theme.spacing(1),
        },
    }),
    { name: 'MFARegister' }
);

const Input = ({
    meta: { touched, error }, // eslint-disable-line react/prop-types
    input: inputProps, // eslint-disable-line react/prop-types
    ...props
}) => (
    <TextField
        error={!!(touched && error)}
        helperText={touched && error}
        {...inputProps} {...props}
    />
);

const MFA = ({redirectTo, ...props}) => {
  const classes = useStyles(props);
  const [loading, setLoading] = useSafeSetState(false);
  const [registered, setRegistered] = useSafeSetState(false);
  const [totp_toggle, setTotpToggle] = useSafeSetState(false);
  const [backup_codes, setBackupCodes] = useSafeSetState(null);
  const history = useHistory();
  const notify = useNotify();
  const translate = useTranslate();
  const uid = sessionStorage.getItem('uid');
  const token = sessionStorage.getItem('token');
  const authHeaders = new Headers({
            Accept: 'application/json',
            Authorization: 'Basic ' + btoa(uid + ':' + token),
            'Content-Type': 'application/json',
            mode: 'no-cors'})

  const validate = (values: FormData) => {
      const errors = { otp_first: undefined };
      const digits = new RegExp('^[0-9]+$');

      if (!values.otp_first) {
          errors.otp_first = translate('ra.validation.required');
      }
      if (values.otp_first && (values.otp_first.length !== 6 ||
                               !digits.test(values.otp_first))) {
          errors.otp_first = 'Enter 6 digits'
      }
      return errors;
  };

  function register ({ otp_first }) {
      const nonce = sessionStorage.getItem('nonce');
      const auth = sessionStorage.getItem('auth');
      sessionStorage.removeItem('nonce');
      const request = new Request(apiUrl + '/auth_totp', {
          method: 'POST',
          body: JSON.stringify({ otp_first, nonce }),
          headers: authHeaders,
      })
      return fetch(request)
          .then (response => {
              if (!response.ok) {
                  throw Error(response.json().message)
              }
              return response.json();
          })
          .then(json => {
              setBackupCodes(json.backup_codes.join("\n"));
              setRegistered(true);
              if (auth && auth.includes('mfarequired')) {
                  sessionStorage.removeItem('auth')
                  sessionStorage.removeItem('token')
              }
              return json;
          })
  }

  function isRegistered () {
      const request = new Request(apiUrl + `/account?filter={"uid":"${uid}"}`, {
          headers: authHeaders,
      })
      // TODO handle errors
      return fetch(request)
          .then((response) => response.json())
          .then(json => {
              setRegistered(json.items[0].totp)
              // TODO: maybe allow a user to toggle MFA off
              if (registered) {
                  setTotpToggle(true)
              }
          })
          .catch(console.error)
  }

  const submit = values => {
      setLoading(true);
      // TODO redirect to /welcome if auth.includes('mfarequired')
      register(values, redirectTo)
          .then(() => {
              setLoading(false);
          })
          .catch(error => {
              setLoading(false);
              notify(
                  typeof error === 'string'
                      ? error
                      : typeof error === 'undefined' || !error.message
                      ? 'ra.auth.sign_in_error'
                      : error.message,
                  'warning',
                  {
                      _:
                          typeof error === 'string'
                              ? error
                              : error && error.message
                              ? error.message
                              : undefined,
                  }
              );
          });
  };

  // TODO this apparently re-invokes endpoint each reference to var registered,
  //and does it 5+ times
  isRegistered();
  // TODO: deal with warning
  // Failed prop type: Invalid prop `children` supplied to `ForwardRef(CardContent)`, expected a ReactNode.
  return (
    <Card>
      <Title title="MFA" />
      <CardContent>
          {totp_toggle && (registered || <MFAGenerate />)}
      </CardContent>
      <CardContent>
        <Form
            onSubmit={submit}
            validate={validate}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit} noValidate>
                    <div className={classes.form}>
                        <div className={classes.input}>
                            Enable TOTP? <Switch
                                id="totp_enabled" name="totp_enabled"
                                onChange={(_, value) => setTotpToggle(value)}
                                disabled={loading}
                                checked={totp_toggle}
                            />
                        </div>
                        {totp_toggle && (registered ||
                        <div className={classes.input}>
                            <Field
                                autoFocus
                                id="otp_first" name="otp_first"
                                label="Enter Verification Code"
                                disabled={loading}
                                component={Input}
                            />
                        </div>)}
                    </div>
                    {backup_codes &&
                    <div><ShowBackupCodes backup_codes={backup_codes} />
                    </div>
                    }
                    <CardActions>
                    <Button variant='contained'
                            type='submit' color='primary' disabled={loading}
                            onClick={() => (!totp_toggle || registered) &&
                                history.push(redirectTo)}
                            className={classes.icon}>
                    {!totp_toggle || registered ?
                            translate('ra.action.close') :
                            translate('ra.action.confirm')}
                    </Button>
                    </CardActions>
                 </form>
            )}
        />
      </CardContent>
    </Card>
  );
};

const ShowBackupCodes = ({ backup_codes }) => (
    <Card>
      <Title title=" - Your backup access tokens" />
      <CardContent>
        <Box color="primary.main" bgcolor="#70ff70" fontFamily="Monospace"
            p={{ xs: 2, sm: 3, md: 4 }} style={{whiteSpace: "pre-line"}}>
          {backup_codes}
        </Box>
        <br /><br />
        Save these single-use codes into a password vault - they cannot be displayed again
        <br />
      </CardContent>
    </Card>
)

MFA.defaultProps = {
    redirectTo: `/account_password/${sessionStorage.getItem('uid')}`
}

export default MFA;
