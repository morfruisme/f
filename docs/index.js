import { API } from './api/wrapper.js';
API.connect();
const setTrack = async () => {
    const track = await API.getPlayingTrack();
    if (!track)
        return;
    document.querySelector('#track p').textContent = track.name;
    document.querySelector('#album p').textContent = `${track.album} - ${track.artists.join(', ')}`;
    const img = document.querySelector('#album img');
    img.src = track.cover_art;
    document.querySelector('#duration').textContent =
        `${Math.floor(track.duration / 60_000)}:${Math.floor((track.duration % 60_000) / 1_000).toString().padStart(2, '0')}`;
};
setTrack();
