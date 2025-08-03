import * as API from "./api/main.js"

const displayMinutes = (t: number) =>
    `${Math.floor(t/60_000)}:${Math.floor((t%60_000)/1_000).toString().padStart(2, "0")}`

const hide = (e: HTMLElement | SVGElement) =>
    e.classList.add("hidden")
const show = (e: HTMLElement | SVGElement) =>
    e.classList.remove("hidden")

const setTrack = async () => {
    const state = await API.state()
    if (!state || !state.is_playing)
        return
    
    const track = state.item!
    document.querySelector("#track")!.textContent = track.name
    document.querySelector("#album")!.textContent =
        `${track.album.name} - ${track.artists.map(a => a.name).join(", ")}`
    const img: HTMLImageElement = document.querySelector("#cover")!
    img.src = track.album.images[0].url

    document.querySelector("#duration")!.textContent = displayMinutes(track.duration_ms)
    document.querySelector("#progress")!.textContent = displayMinutes(state.progress_ms)
}

const playIcon: HTMLElement = document.querySelector("#play use[href='#play_icon']")!
const pauseIcon: HTMLElement = document.querySelector("#play use[href='#pause_icon']")!
let isPlaying = true;

const play: HTMLButtonElement = document.querySelector("#play")!
play.addEventListener("click", () => {
    isPlaying = !isPlaying
    
    if (isPlaying) {
        hide(playIcon)
        show(pauseIcon)
        API.play()
    }
    else {
        show(playIcon)
        hide(pauseIcon)
        API.pause()
    }
})

const prev: HTMLButtonElement = document.querySelector('#prev')!
prev.addEventListener('click', API.previous)

const next: HTMLButtonElement = document.querySelector('#next')!
next.addEventListener('click', API.next)

setInterval(setTrack, 500)
