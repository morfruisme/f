import { reqCode, reqRefreshToken } from './auth.js'

export namespace API {
    let origin = 'https://api.spotify.com/v1'
    let _token = localStorage.getItem('access_token')
    let _refreshToken = localStorage.getItem('refresh_token')

    export const connect = async () => {
        const response = await call('/me')

        alert(`${response.status}    ${_refreshToken}`)

        if (response.status == 200 || (_refreshToken && await reqRefreshToken(_refreshToken)))
            return
        await reqCode()
    }

    export const getPlayingTrack = async () => {
        const response = await call('/me/player/currently-playing')
        if (response.status != 200)
            return null

        const data = await response.json()
        return `${data.item.name} - ${data.item.artists[0].name}`

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