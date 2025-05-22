import { reqCode, reqRefreshToken } from './auth.js'

export namespace API {
    let origin = 'https://api.spotify.com/v1'
    let _token = localStorage.getItem('access_token')
    let _refreshToken = localStorage.getItem('refresh_token')

    export const connect = async () => {
        const response = await call('/me')

        if (response.status == 200 || (_refreshToken && await reqRefreshToken(_refreshToken)))
            return
        await reqCode()
    }

    type Track = {
        name: string,
        artists: string[],
        album: string,
        cover_art: string,
        duration: number
    }

    export const getPlayingTrack = async (): Promise<Track | null> => {
        const response = await call('/me/player/currently-playing')
        if (response.status != 200)
            return null

        const data = await response.json()
        return {
            name: data.item.name,
            artists: data.item.artists.map((a: any) => a.name),
            album: data.item.album.name,
            cover_art: data.item.album.images[0].url,
            duration: data.item.duration_ms
        }
    }

    const call = (endpoint: string) => {
        const payload = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${_token}`
            }
        }

        const url = `${origin}${endpoint}`
        return fetch(url, payload)
    }
}