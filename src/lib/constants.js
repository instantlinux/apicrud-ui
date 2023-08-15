// created 25-may-2019 by rich braun <docker@instantlinux.net>

// export const apiUrl = process.env.REACT_APP_API_URL;
export const apiUrl = import.meta.env.REACT_APP_API_URL;
export const apiCacheSec = 30;
export const defaultThumbnailSizes = [120, 720];
export const localeChoices = [
    { id: 'ar', name: 'عربى • Arabic' },
    { id: 'de', name: 'Deutsche • German' },
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Español • Spanish' },
    { id: 'fil', name: 'Pilipino • Tagalog' },
    { id: 'fr', name: 'Français • French' },
    { id: 'it', name: 'Italiano • Italian' },
    { id: 'ko', name: '한국어 • Korean' },
    { id: 'pt', name: 'Português • Portuguese' },
    { id: 'ru', name: 'русский • Russian' },
    { id: 'vi', name: 'Tiếng Việt • Vietnamese' },
    { id: 'zh_Hans', name: '简体中文 • Chinese' },
    { id: 'zh_Hant', name: '繁體中文 • Chinese (Trad)' },
]
export const privacyChoices = [
    { id: 'public', name: 'public' },
    { id: 'invitee', name: 'invitees' },
    { id: 'member', name: 'members only' },
    { id: 'secret', name: 'secret' }]
export const profileChoices = [
    { id: 'birthday', name: 'Birthday' },
    { id: 'college', name: 'College' },
    { id: 'degree', name: 'Degree' },
    { id: 'employer', name: 'Employer' },
    { id: 'gender', name: 'Gender' },
    { id: 'highschool', name: 'High School' },
    { id: 'hometown', name: 'Hometown' },
    { id: 'jobtitle', name: 'Job Title' },
    { id: 'lang', name: 'Language' },
    { id: 'location', name: 'Location' },
    { id: 'partner', name: 'Spouse / Partner' },
    { id: 'picture', name: 'Picture' },
    { id: 'pronouns', name: 'Pronouns' },
    { id: 'reminders', name: 'Reminders' },
    { id: 'tz', name: 'Timezone' },
    { id: 'website', name: 'Website' },
]
export const pronounChoices = [
    { id: 'he/him/his', name: 'he/him/his' },
    { id: 'she/her/hers', name: 'she/her/hers' },
    { id: 'they/they/their', name: 'they/them/theirs' },
]

export const skipAuthPaths = /^#\/(account\/create|account_password|event)/

/*
 * On UPDATE, this list excludes any read-only fields fetched by GET
 *  or which are response-only fields that are never included in POST
 */
export const excludeFields = [
    'created', 'geo', 'id', 'referrer_id', 'responded', 'sender_id', 'viewed',
    'category', 'default_category', 'invalid_attempts', 'is_encrypted',
    'last_invalid_attempt', 'last_login', 'last_used', 'lists', 'magic_expires',
    'message', 'modified', 'orientation', 'owner', 'prefix', 'rbac', 'sha1',
    'sha256', 'thumbnail50x50'];
export const excludeExifFields = [
    'compression', 'datetime_original', 'duration', 'gps_altitude', 'height',
    'make', 'model', 'width'];
