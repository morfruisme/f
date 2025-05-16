import { origin, clientId, scope } from './config.js';
const redirectUri = `${origin}/auth`;
const randomString = (length) => {
    const alnum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + alnum[x % alnum.length], '');
};
const sha256 = (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
};
const base64url = (buff) => {
    return btoa(String.fromCharCode(...new Uint8Array(buff)))
        .replace(/=/g, '')
        .replace(/\+/, '-')
        .replace(/\//g, '_');
};
export const reqCode = async () => {
    const state = randomString(16);
    sessionStorage.setItem('state', state);
    const codeVerifier = randomString(64);
    sessionStorage.setItem('code_verifier', codeVerifier);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64url(hashed);
    const params = {
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        state: state,
        scope: scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge
    };
    const url = new URL('https://accounts.spotify.com/authorize');
    url.search = new URLSearchParams(params).toString();
    location.href = url.toString();
};
const reqToken = async (body) => {
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
    };
    const url = 'https://accounts.spotify.com/api/token';
    const response = await fetch(url, payload);
    if (response.status != 200)
        return false;
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    if (data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token);
    return true;
};
export const reqNewToken = (code) => {
    const codeVerifier = sessionStorage.getItem('code_verifier');
    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
    });
    return reqToken(body);
};
export const reqRefreshToken = (refreshToken) => {
    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId
    });
    return reqToken(body);
};
