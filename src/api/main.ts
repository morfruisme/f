import { connect } from './auth.js'
import { Track } from './types.js'

const origin = 'https://api.spotify.com/v1'
export const token = localStorage.getItem('access_token')!

const ensureConnected = async () => {
    const response = await call('/me')
    if (response.status != 200)
        await connect()
}

const call = (endpoint: string, method = 'GET') => {
    const payload = {
        method,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    const url = `${origin}${endpoint}`
    return fetch(url, payload)
}

export const current = async (): Promise<Track | null> => {
    const response = await call('/me/player/currently-playing')
    if (response.status != 200)
        return null

    const data = await response.json()
    return {
        name: data.item.name,
        artists: data.item.artists.map((a: any) => a.name),
        album: data.item.album.name,
        cover: data.item.album.images[0].url,
        progress: data.progress_ms,
        duration: data.item.duration_ms,
    }
}

export const play     = () => call('/me/player/play'    , 'PUT')
export const pause    = () => call('/me/player/pause'   , 'PUT')
export const previous = () => call('/me/player/previous', 'POST')
export const next     = () => call('/me/player/next'    , 'POST')

export const search = async (q: string)
: Promise<{ name: string, artists: string[], id: string} | null> => {
    const query = new URLSearchParams({ q, type: 'track', limit: '1' })
    const response = await call(`/search?${query}`)
    if (response.status != 200)
        return null

    const data = await response.json()
    const track = data.tracks.items[0]
    return {
        name: track.name,
        artists: track.artists.map((a: any) => a.name),
        id: track.id,
    }
}

await ensureConnected()
console.log('Connected to the API !')
