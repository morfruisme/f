const isLocal = location.origin == 'http://[::1]:3000';
const baseUrl = location.origin + (isLocal ? '' : '/f');
alert(isLocal);
alert(baseUrl);
const clientId = 'aa2c6b8bc7f6401db0e70a5a07b2b24d';
const scope = 'user-read-email user-read-currently-playing';
export { baseUrl, clientId, scope };
