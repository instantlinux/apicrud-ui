// Prefs link for update, accessed via magic-link URL
// created 5-may-2019 by rich braun <docker@instantlinux.net>

import queryString from 'query-string';
import decodeJwt from 'jwt-decode';

const apiUrl = import.meta.env.REACT_APP_API_URL;

export const Prefs = props => {
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
                    throw new Error(response.statusText);
                }
                return response.json();
        })
	.then(function(json) {
            const decodedJwt = decodeJwt(json['jwt_token']);
            sessionStorage.setItem('uid', decodedJwt.sub);
            sessionStorage.setItem('token', decodedJwt.jti);
	    sessionStorage.setItem('guest_id', json['guest_id']);
	    sessionStorage.setItem('auth', decodedJwt.auth);
	    window.location = '/#/person/' + decodedJwt.sub;
	    window.location.reload(true);
        });
};

export default Prefs;
