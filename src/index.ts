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

setInterval(setTrack, 500)
