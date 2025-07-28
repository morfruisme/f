import { connect } from './auth.js'
import { SimpleTrack, Track, PlayingTrack } from './types.js'

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

export const current = async (): Promise<PlayingTrack | null> => {
    const response = await call('/me/player/currently-playing')
    if (response.status != 200)
        return null

    const data = await response.json()
    return {
        id: data.item.id,
        name: data.item.name,
        artists: data.item.artists.map((a: any) => a.name),
        album: data.item.album.name,
        cover: data.item.album.images[0].url,
        duration_ms: data.item.duration_ms,
        progress_ms: data.progress_ms,
    }
}

export const play     = () => call('/me/player/play'    , 'PUT')
export const pause    = () => call('/me/player/pause'   , 'PUT')
export const previous = () => call('/me/player/previous', 'POST')
export const next     = () => call('/me/player/next'    , 'POST')

export const search = async (q: string, limit: number): Promise<SimpleTrack[]> => {
    const query = new URLSearchParams({ q, type: 'track', limit: `${limit}` })
    const response = await call(`/search?${query}`)
    if (response.status != 200)
        return []

    const data = await response.json()
    const tracks = data.tracks.items
    return tracks.map((track: any) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((a: any) => a.name),
    }))
}

await ensureConnected()
console.log('Connected to the API !')
