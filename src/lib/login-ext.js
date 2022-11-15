// created 28-mar-2021 by rich braun <docker@instantlinux.net>
// auth provider for external login

// TODO this page throws error
//  "Objects are not valid as a React child"
//  because I haven't yet learned what placeholder child elements are

import queryString from 'query-string';
import decodeJwt from 'jwt-decode';

const apiUrl = import.meta.env.REACT_APP_API_URL;

export const loginExt = props => {
    const query = queryString.parse(props.location.search);
    const { token } = query;
    const decodedJwt = decodeJwt(token);
    sessionStorage.setItem('uid', decodedJwt.sub);
    sessionStorage.setItem('token', decodedJwt.jti);
    sessionStorage.setItem('auth', decodedJwt.auth);
    sessionStorage.setItem('account_id', decodedJwt.acc);
    const request = new Request(apiUrl + '/auth_params', {
        headers: new Headers({
        Accept: 'application/json',
        Authorization: 'Basic ' + btoa(
            decodedJwt.sub + ':' + decodedJwt.jti),
        mode: 'no-cors'})
    })
    fetch(request)
        .then(response => {
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(({ resources, storage_id, settings_id }) => {
            sessionStorage.setItem('resource_endpoints',
                JSON.stringify(resources));
            sessionStorage.setItem('settings_id', settings_id);
            sessionStorage.setItem('storage_id', storage_id);
            window.location = '/#/welcome';
        });
    return null;
};
export default loginExt;
