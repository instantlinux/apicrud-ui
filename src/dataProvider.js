// data provider for react-admin
// created 25-mar-2019 by rich braun <docker@instantlinux.net>
// rewritten 24-feb-2020

import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

import { apiCacheSec, excludeExifFields, excludeFields
       } from './lib/constants';

function urlPrefix(resource) {
    const fallbackUrl = process.env.REACT_APP_API_URL;
    var res = JSON.parse(sessionStorage.getItem('resource_endpoints'))
    return `${res && resource in res ? res[resource] : fallbackUrl}/${resource}`;
}

function httpClient(url, options={}) {
    const uid = sessionStorage.getItem('uid');
    const token = sessionStorage.getItem('token');
    options.headers = new Headers({
        Accept: 'application/json',
        Authorization: 'Basic ' + btoa(uid + ':' + token),
    })
    // console.log('httpClient ' + url + ', opt=' + JSON.stringify(options));
    return fetchUtils.fetchJson(url, {...options, credentials: 'include'});
}

function cacheSeconds(seconds=apiCacheSec) {
    const validUntil = new Date();
    validUntil.setTime(validUntil.getTime() + seconds * 1000);
    return validUntil;
}

const dataProvider = {
    getList: (resource, params) => {
        const query = {
            limit: params.pagination.perPage,
            offset: (params.pagination.page - 1) * params.pagination.perPage,
            status: ['active'],
        };
        if (params.sort) {
            query.sort = params.sort.field + ':' + params.sort.order.toLowerCase();
        }
        if (params.filter.hasOwnProperty('q')) {
            params.filter.name = params.filter.q + '%';
            delete params.filter.q;
        }
        if (Object.keys(params.filter).length > 0) {
            query.filter = JSON.stringify(params.filter);
        }
        return httpClient(`${urlPrefix(resource)}?${stringify(query)}`).then((
            { json }) => ({ data: json.items, total: json.count,
                            validUntil: cacheSeconds() })) },

    getOne: (resource, params) =>
        httpClient(`${urlPrefix(resource)}/${params.id}`).then((
            { json }) => ({ data: json, validUntil: cacheSeconds() })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
            limit: params.ids.length,
        };
        return httpClient(`${urlPrefix(resource)}?${stringify(query)}`).then((
            { json }) => ({ data: json.items, total: json.count,
                            validUntil: cacheSeconds() })) },

    getManyReference: (resource, params) => {
        const { field, order } = params.sort;
        var filter = { ...params.filter, [params.target]: params.id }
        if (params.target in params.filter) {
            // Not documented but filter-override appears to be required
            filter[params.target] = params.filter[params.target]
        }
        const query = {
            limit: params.pagination.perPage,
            offset: (params.pagination.page - 1) * params.pagination.perPage,
            sort: field + ':' + order.toLowerCase(),
            filter: JSON.stringify(filter),
        };
        return httpClient(`${urlPrefix(resource)}?${stringify(query)}`).then((
            { json }) => ({ data: json.items, total: json.count,
                            validUntil: cacheSeconds() })) },

    update: (resource, params) => {
        excludeFields.forEach(function(val) {
            delete params.data[val];
        });
	if (resource === 'picture') {
	  excludeExifFields.forEach(function(val) {
	      delete params.data[val];
	  })
        }
        const options = {method: 'PUT', body: JSON.stringify(params.data)};
        return httpClient(`${urlPrefix(resource)}/${params.id}`,
            options).then(({ json }) => ({ data: json })) },

    create: (resource, params) =>
        httpClient(`${urlPrefix(resource)}`, {
            method: 'POST', body: JSON.stringify(params.data)})
        .then(({ json }) => ({ data: json })),

    delete: (resource, params) =>
        httpClient(`${urlPrefix(resource)}/${params.id}`, {
            method: 'DELETE'})
        .then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) =>
        httpClient(`${urlPrefix(resource)}/${params.ids.join()}`, {
            method: 'DELETE'})
        .then(({ json }) => ({ data: json })),
};

export default dataProvider;
