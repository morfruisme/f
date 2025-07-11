import { connect } from './auth.js'
import { Track } from './types.js'

const origin = 'https://api.spotify.com/v1'
const token = localStorage.getItem('access_token')

const ensureConnected = async () => {
    const response = await call('/me')
    if (response.status != 200)
        await connect()
}

const call = (endpoint: string) => {
    const payload = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    const url = `${origin}${endpoint}`
    return fetch(url, payload)
}

export const playingTrack = async (): Promise<Track | null> => {
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

await ensureConnected()
console.log('Connected to the API !')
