import * as API from './api/main.js'

const timeMS= (t: number) =>
    `${Math.floor(t/60_000)}:${Math.floor((t%60_000)/1_000).toString().padStart(2, '0')}`

const setTrack = async () => {
    const track = await API.playingTrack()
    if (!track)
        return

    document.querySelector('#track')!.textContent = track.name
    document.querySelector('#album')!.textContent = `${track.album} - ${track.artists.join(', ')}`
    const img: HTMLImageElement = document.querySelector('#cover')!
    img.src = track.cover

    document.querySelector('#duration')!.textContent = timeMS(track.duration)
    document.querySelector('#progress')!.textContent = timeMS(track.progress)
}

const prev: HTMLButtonElement = document.querySelector('#prev')!
prev.addEventListener('click', API.prev)

let isPlaying = true;
const togglePlay = () => {
    isPlaying = !isPlaying

    const play: HTMLElement = document.querySelector('#play use[href=\'#play_icon\']')!
    const pause: HTMLElement = document.querySelector('#play use[href=\'#pause_icon\']')!
        
    if (isPlaying) {
        play.style.display = 'none'
        pause.style.display = ''
        API.play()
    }
    else {
        play.style.display = ''
        pause.style.display = 'none'
        API.pause()
    }
}
const play: HTMLButtonElement = document.querySelector('#play')!
play.addEventListener('click', togglePlay)

const next: HTMLButtonElement = document.querySelector('#next')!
next.addEventListener('click', API.next)



setInterval(setTrack, 500)



// gros slop
const script = document.createElement('script')
script.src = 'https://sdk.scdn.co/spotify-player.js'
document.head.appendChild(script)

window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new window.Spotify.Player({
        name: 'f',
        getOAuthToken: cb => { cb(API.token); },
        volume: 0.5,
    })

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    })

    player.connect()
}
