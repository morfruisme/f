import { connect } from './auth.js'
import { Track, PlaybackState } from './types.js'

const origin = 'https://api.spotify.com/v1'
export const token = localStorage.getItem('access_token')!

const ensureConnected = async () => {
    const res = await get('/me')
    console.log(res)
    if (res === null) {
        await connect()
    }
}

const call = (method: "GET" | "PUT" | "POST", endpoint: string) => {
    const payload = {
        method,
        headers: { "Authorization": `Bearer ${token}` }
    }
    const url = `${origin}${endpoint}`
    return fetch(url, payload)
}

const get = async <T>(endpoint: string): Promise<T | null> =>
    call("GET", endpoint).then(response => response.ok ? response.json() : null)

const put  = (endpoint: string) =>
    call("PUT",  endpoint).then(response => response.ok)

const post = (endpoint: string) =>
    call("POST", endpoint).then(response => response.ok)

export const state = async () => get<PlaybackState>('/me/player/currently-playing')
export const play     = () => put("/me/player/play")
export const pause    = () => put("/me/player/pause")
export const previous = () => post("/me/player/previous")
export const next     = () => post("/me/player/next")

export const search = async (q: string, limit: number): Promise<Track[]> => {
    const query = new URLSearchParams({ q, type: 'track', limit: `${limit}` })
    const tracks = await get<Track[]>(`/search?${query}`)
    return tracks ? tracks : []
}

await ensureConnected()
console.log('Connected to the API !')
