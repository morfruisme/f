import * as API from './api/main.js';
const timeMS = (t) => `${Math.floor(t / 60_000)}:${Math.floor((t % 60_000) / 1_000).toString().padStart(2, '0')}`;
const setTrack = async () => {
    const track = await API.playingTrack();
    if (!track)
        return;
    document.querySelector('#track').textContent = track.name;
    document.querySelector('#album').textContent = `${track.album} - ${track.artists.join(', ')}`;
    const img = document.querySelector('#cover');
    img.src = track.cover;
    document.querySelector('#duration').textContent = timeMS(track.duration);
    document.querySelector('#progress').textContent = timeMS(track.progress);
};
const prev = document.querySelector('#prev');
prev.addEventListener('click', API.prev);
let isPlaying = true;
const togglePlay = () => {
    isPlaying = !isPlaying;
    const play = document.querySelector('#play use[href=\'#play_icon\']');
    const pause = document.querySelector('#play use[href=\'#pause_icon\']');
    if (isPlaying) {
        play.style.display = 'none';
        pause.style.display = '';
        API.play();
    }
    else {
        play.style.display = '';
        pause.style.display = 'none';
        API.pause();
    }
};
const play = document.querySelector('#play');
play.addEventListener('click', togglePlay);
const next = document.querySelector('#next');
next.addEventListener('click', API.next);
setInterval(setTrack, 500);
