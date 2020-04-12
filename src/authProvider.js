// created 25-mar-2019 by rich braun <docker@instantlinux.net>

import decodeJwt from 'jwt-decode';
import { skipAuthPaths } from './lib/constants';

const apiUrl = process.env.REACT_APP_API_URL;

export default {
    login: ({ username, password }) => {
        const request = new Request(apiUrl + '/auth', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ jwt_token, storage_id, settings_id }) => {
                const decodedJwt = decodeJwt(jwt_token);
                sessionStorage.setItem('uid', decodedJwt.sub);
                sessionStorage.setItem('token', decodedJwt.jti);
                sessionStorage.setItem('auth', decodedJwt.auth);
                sessionStorage.setItem('account_id', decodedJwt.acc);
                sessionStorage.setItem('settings_id', settings_id);
                sessionStorage.setItem('storage_id', storage_id);
                // console.log('auth: ' + JSON.stringify(decodedJwt));
            });
    },
    logout: () => {
        const uid = sessionStorage.getItem('uid');
        const token = sessionStorage.getItem('token');
        const headers = new Headers({
            Accept: 'application/json',
            Authorization: 'Basic ' + btoa(uid + ':' + token),
            mode: 'no-cors',
        });
        const request = new Request(apiUrl + '/logout', {
            method: 'GET',
            headers: headers,
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
            return Promise.resolve(auth);
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
