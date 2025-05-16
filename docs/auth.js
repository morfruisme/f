import { reqCode, reqNewToken, reqRefreshToken } from './api/auth';
const params = new URLSearchParams(location.search);
const code = params.get('code');
const state = params.get('state');
const refreshToken = localStorage.getItem('refresh_token');
if (code && state && state == sessionStorage.getItem('state')) {
    sessionStorage.removeItem('state');
    if (await reqNewToken(code))
        location.href = `${origin}/?connected`;
    else
        await reqCode();
}
else if (refreshToken) {
    alert("refresh");
    if (await reqRefreshToken(refreshToken)) {
        alert("done");
        location.href = `${origin}/?connected`;
    }
    else
        await reqCode();
}
else
    await reqCode();
