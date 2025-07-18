import { connect } from './auth.js';
const origin = 'https://api.spotify.com/v1';
export const token = localStorage.getItem('access_token');
const ensureConnected = async () => {
    const response = await call('/me');
    if (response.status != 200)
        await connect();
};
const call = (endpoint, method = 'GET') => {
    const payload = {
        method,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    const url = `${origin}${endpoint}`;
    return fetch(url, payload);
};
export const playingTrack = async () => {
    const response = await call('/me/player/currently-playing');
    if (response.status != 200)
        return null;
    const data = await response.json();
    return {
        name: data.item.name,
        artists: data.item.artists.map((a) => a.name),
        album: data.item.album.name,
        cover: data.item.album.images[0].url,
        progress: data.progress_ms,
        duration: data.item.duration_ms,
    };
};
export const prev = () => call('/me/player/previous', 'PUT');
export const play = () => call('/me/player/play', 'PUT');
export const pause = () => call('/me/player/pause', 'PUT');
export const next = () => call('/me/player/next', 'PUT');
await ensureConnected();
console.log('Connected to the API !');
