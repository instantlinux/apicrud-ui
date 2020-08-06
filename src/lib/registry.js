// created 9-may-20 by rich braun <docker@instantlinux.net>

/**
 * Returns true if the dataProvider has access to a named resource
 * (top-level endpoint served by a microservice) through service-
 * registry on the API backend
 *
 * @param {str} resource - endpoint resource prefix
 * @returns {bool} - resource is available
 */
export default function isRegistered(resource) {
    var res = JSON.parse(sessionStorage.getItem('resource_endpoints'));
    if (res && resource in res) {
    	return true;
    }
    return false;
}
