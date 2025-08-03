import { connect } from './auth.js';
const origin = 'https://api.spotify.com/v1';
export const token = localStorage.getItem('access_token');
const ensureConnected = async () => {
    const res = await get('/me');
    if (res === null)
        await connect();
};
const call = (method, endpoint) => {
    const payload = {
        method,
        headers: { "Authorization": `Bearer ${token}` }
    };
    const url = `${origin}${endpoint}`;
    return fetch(url, payload);
};
const get = async (endpoint) => call("GET", endpoint).then(response => response.status === 200 ? response.json() : null);
const put = (endpoint) => call("PUT", endpoint).then(response => response.ok);
const post = (endpoint) => call("POST", endpoint).then(response => response.ok);
export const state = async () => get('/me/player');
export const play = () => put("/me/player/play");
export const pause = () => put("/me/player/pause");
export const previous = () => post("/me/player/previous");
export const next = () => post("/me/player/next");
export const search = async (q, limit) => {
    const query = new URLSearchParams({ q, type: 'track', limit: `${limit}` });
    const data = await get(`/search?${query}`);
    return data ? data.tracks.items : [];
};
await ensureConnected();
console.log('Connected to the API !');
