// created 25-mar-2019 by rich braun <docker@instantlinux.net>

import decodeJwt from 'jwt-decode';
import { skipAuthPaths } from './lib/constants';

const apiUrl = import.meta.env.VITE_API_URL;

function authHeaders () {
    const uid = sessionStorage.getItem('uid');
    const token = sessionStorage.getItem('token');
    return new Headers({
        Accept: 'application/json',
        Authorization: 'Basic ' + btoa(uid + ':' + token),
        'Content-Type': 'application/json',
    });
};

function oauth_redir (loc) {
    window.location = loc;
};

const authProvider = {
    login: ({username, password, method, otp}) => {
        var headers;
        if (sessionStorage.getItem('auth') === 'pendingtotp') {
            headers = authHeaders();
        } else {
            headers = new Headers({ 'Content-Type': 'application/json' });
        }
        const request = new Request(apiUrl + '/auth', {
            method: 'POST',
            body: JSON.stringify({ username, password, method, otp }),
            credentials: 'include',
            headers: headers,
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 303) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(response => method === undefined || method === 'local' ?
                  response : oauth_redir(response.location)
                  // TODO see if this line can be removed
                  .then(response => response.json()))
            .then(({ jwt_token, resources, storage_id, settings_id }) => {
                const decodedJwt = decodeJwt(jwt_token);
                sessionStorage.setItem('uid', decodedJwt.sub);
                sessionStorage.setItem('token', decodedJwt.jti);
                sessionStorage.setItem('auth', decodedJwt.auth);
                sessionStorage.setItem('account_id', decodedJwt.acc);
                sessionStorage.setItem('resource_endpoints',
                    JSON.stringify(resources));
                sessionStorage.setItem('settings_id', settings_id);
                sessionStorage.setItem('storage_id', storage_id);
                // console.log('auth: ' + JSON.stringify(decodedJwt));
                if (decodedJwt.auth.includes('pendingtotp')) {
                    throw new Error('pendingtotp')
                }
                else if (decodedJwt.auth.includes('mfarequired')) {
                    window.location = '/#/mfa'
                    window.location.reload(true)
                }
            });
    },
    logout: () => {
        console.log('apiURL=' + apiUrl);

        const request = new Request(apiUrl + '/logout', {
            method: 'GET',
            headers: authHeaders (),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('auth');
                sessionStorage.removeItem('account_id');
                sessionStorage.removeItem('uid');
                Promise.resolve();
                return '/welcome';
            });
    },
    getPermissions: () => {
        const auth = sessionStorage.getItem('auth');
        // console.log('getPermissions: ' + auth);
        if (auth || window.location.hash.match(skipAuthPaths)) {
            return Promise.resolve(auth || '');
        }
        return Promise.resolve('');
    },
    checkError: (error) => {
        if (error.status === 401) {
            sessionStorage.removeItem('token');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    checkAuth: () => {
        if (sessionStorage.getItem('token') ||
                window.location.hash.match(skipAuthPaths)) {
            return Promise.resolve();
        }
        return Promise.reject();
    }
};

export default authProvider;
