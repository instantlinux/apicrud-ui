// created 23 mar 2021 by richb @ instantlinux.net
//  adapted from standard ra-ui-materialui form
import React, { useEffect, useState } from 'react';
import { useLogin, useSafeSetState, useTranslate } from 'react-admin';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Field, Form } from 'react-final-form';
import { Avatar, Button, ButtonGroup, CardActions, CircularProgress, TextField,
         makeStyles } from '@material-ui/core';
import { useNotify } from 'ra-core';

import facebookLogo from '../images/facebook-logo.png';
import githubLogo from '../images/github-logo.png';
import googleLogo from '../images/google-logo.png';
import twitterLogo from '../images/twitter-logo.png';
import { apiUrl } from '../lib/constants';

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
    { name: 'RaLoginButton' }
);

const Input = ({
    meta: { touched, error }, // eslint-disable-line react/prop-types
    input: inputProps, // eslint-disable-line react/prop-types
    ...props
}) => (
    <TextField
        error={!!(touched && error)}
        helperText={touched && error}
        {...inputProps}
        {...props}
        fullWidth
    />
);

function LoginButton ({ redirectTo, ...props }) {
    const [loading, setLoading] = useSafeSetState(false);
    const login = useLogin();
    const history = useHistory();
    const translate = useTranslate();
    const notify = useNotify();
    const classes = useStyles(props);

    const handleLoginLocal = (code, state) => {
        setLoading(true)
        login({ code, state })
            .catch(error => {})
    }

    const handleLoginOAuth = (method, code, state) => {
        setLoading(true)
        login({ method, state })
            .catch(error => {})
    }

    function logo (method) {
      switch (method) {
        case 'facebook': return facebookLogo;
        case 'github': return githubLogo;
        case 'google': return googleLogo;
        case 'twitter': return twitterLogo; }
    }

    const loadingProgress = (
        <CircularProgress className={classes.icon} size={18} thickness={2} />
    );

    useEffect(() => {
        const { searchParams } = new URL(window.location.href);
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (code && state) {
            handleLoginLocal(code, state);
        }
    }, [])

    const validate = (values: FormData) => {
        const errors = { username: undefined, password: undefined };

        if (!values.username) {
            errors.username = translate('ra.validation.required');
        }
        if (!values.password) {
            errors.password = translate('ra.validation.required');
        }
        return errors;
    };

    class AuthButtons extends React.Component {
      constructor(props){
        super(props);
        this.state = { data: null }
      }
      componentDidMount(){
        fetch(apiUrl + '/auth_methods')
          .then(response => response.json())
          .then(data => this.setState({
            methods: data.items,
            policies: data.policies
          }))
      }
      render() {
        const { methods, policies } = this.state;
        const buttons = [];
        if (methods) {
          if (methods.includes('local') && ['open', 'onrequest'].includes(
                policies['login_internal']))  {
            buttons.push(
              <Button {...props}
                onClick={() => history.push('/account/create?forgot=false')}
                  variant="contained" color="primary"
                  disabled={loading}
                  className={classes.button}>
                {loading && loadingProgress}
                {translate('ra.action.create')} {translate('ra.auth.username')}
              </Button>
            )
          }
          // TODO fix error "Each child in a list should have a unique key prop"
          for (const method of methods) {
            if (method !== 'local') {
              buttons.push(
                <div><Button {...props}
                  onClick={() => handleLoginOAuth(method)}
                    variant="contained" color="primary"
                    disabled={loading}
                    className={classes.button}>
                  {loading && loadingProgress}
                  {logo(method) &&
                   <Avatar src={logo(method)} className={classes.avatar} />}
                  {translate('ra.auth.sign_in')} with {method}
                </Button></div>
              )
            }
          }
        }
        return (<div>{buttons}</div>)
      }
    }

    const submit = values => {
        setLoading(true);
        login(values, redirectTo)
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

    return (
        <Form
            onSubmit={submit}
            validate={validate}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit} noValidate>
                    <div className={classes.form}>
                        <div className={classes.input}>
                            <Field
                                autoFocus
                                id="username"
                                name="username"
                                component={Input}
                                label={translate('ra.auth.username')}
                                disabled={loading}
                            />
                        </div>
                        <div className={classes.input}>
                            <Field
                                id="password"
                                name="password"
                                component={Input}
                                label={translate('ra.auth.password')}
                                type="password"
                                disabled={loading}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>
                    <CardActions>
                      {/* TODO whether or not fullWidth is specified here,
                       an error message appears from React for it and
                       disableElevation, disableFocusRipple, disableRipple */}
                      <ButtonGroup fullWidth={true} orientation='vertical'>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading}
                            className={classes.button}
                        >
                            {loading && (
                                <CircularProgress
                                    className={classes.icon}
                                    size={18}
                                    thickness={2}
                                />
                            )}
                            {translate('ra.auth.sign_in')}
                        </Button><br />
                        <AuthButtons />
                      </ButtonGroup>
                    </CardActions>
                </form>
            )}
        />
    );
};

LoginButton.propTypes = {
    redirectTo: PropTypes.string,
};

LoginButton.defaultProps = {
  redirectTo: '/'
}

export default LoginButton;
