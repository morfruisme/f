import { connect } from "./auth.js";
export * from "./types.js";
export { state, play, pause, previous, next, search };
const origin = 'https://api.spotify.com/v1';
const token = localStorage.getItem('access_token');
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
const state = async () => get('/me/player');
const play = () => put("/me/player/play");
const pause = () => put("/me/player/pause");
const previous = () => post("/me/player/previous");
const next = () => post("/me/player/next");
const search = async (q, limit) => {
    const query = new URLSearchParams({ q, type: "album", limit: `${limit}` });
    const data = await get(`/search?${query}`);
    return data ? data.albums.items : [];
};
// ensure we're connected
if (await get('/me') === null)
    await connect();
console.log('Connected to the API !');
