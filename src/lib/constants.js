// created 25-may-2019 by rich braun <docker@instantlinux.net>

export const apiUrl = process.env.REACT_APP_API_URL;
export const apiCacheSec = 30;
export const defaultThumbnailSizes = [120, 720];
export const privacyChoices = [
    { id: 'public', name: 'public' },
    { id: 'invitee', name: 'invitees' },
    { id: 'member', name: 'guests only' },
    { id: 'secret', name: 'secret' }]
export const skipAuthPaths = /^#\/(account\/create|account_password|event)/
export const toolbarOpts = [
    [{'font': []}, {'size': ['small', false, 'large', 'huge']},
     'bold', 'italic', 'underline', 'blockquote',
     {'indent': '-1'}, {'indent': '+1'},
     {'list': 'ordered'}, {'list': 'bullet'},
     {'color': []}, {'background': []}, 'link', {'align': []}  ]];

/*
 * On UPDATE, this list excludes any read-only fields fetched by GET
 *  or which are response-only fields that are never included in POST
 */
export const excludeFields = [
    'created', 'geo', 'id', 'referrer_id', 'responded', 'sender_id', 'viewed',
    'category', 'default_category', 'invalid_attempts', 'is_encrypted',
    'last_invalid_attempt', 'last_login', 'lists', 'magic_expires', 'modified',
    'orientation', 'owner', 'rbac', 'sha1', 'sha256', 'thumbnail50x50'];
export const excludeExifFields = [
    'compression', 'datetime_original', 'duration', 'gps_altitude', 'height',
    'make', 'model', 'width'];

export default toolbarOpts;
