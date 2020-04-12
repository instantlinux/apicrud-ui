// Auth provider for access via magic-link URLs
// created 5-may-2019 by docker@instantlinux.net

import queryString from 'query-string';
import decodeJwt from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;

export const magic = props => {
    const query = queryString.parse(props.location.search);
    const { guest_id, magic, cid } = query;
    const request = new Request(apiUrl + '/auth', {
        method: 'POST',
        body: JSON.stringify({ guest_id, magic, cid }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
    })
    return fetch(request)
        .then(response =>  {
                if (response.status < 200 || response.status >= 300) {
                    return Promise.reject();
                }
                return response.json();
        })
        .then(function(json) {
            const decodedJwt = decodeJwt(json['jwt_token']);
            sessionStorage.setItem('uid', decodedJwt.sub);
            sessionStorage.setItem('token', decodedJwt.jti);
            sessionStorage.setItem('guest_id', json['guest_id']);
            sessionStorage.setItem('auth', decodedJwt.auth);
            sessionStorage.setItem('storage_id', json.storage_id);
            window.location = '/#/event/' + decodedJwt.eid + '/show';
            window.location.reload(true);
        });
};

export default magic;
