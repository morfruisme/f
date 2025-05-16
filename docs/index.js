import { API } from './api/wrapper.js';
API.connect();
const track = await API.getPlayingTrack();
document.querySelector('#recent').textContent =
    track ? `Playing : ${track}` : 'No track is being played';
