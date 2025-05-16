import { clientId } from './config.js'

const api_url = 'https://api.spotify.com/v1/'

const params = new URLSearchParams(location.search)
if (!params.has('connected') || !localStorage.getItem('access_token') || !localStorage.getItem('refresh_token'))
    location.href = '/auth'

let token = localStorage.getItem('access_token')!
let refresh = localStorage.getItem('refresh_token')!

const refreshToken = async () => {
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh,
            client_id: clientId
        }).toString()
    }

    const url = 'https://accounts.spotify.com/api/token'
    const response = await fetch(url, payload)
    const data = await response.json()

    localStorage.setItem('access_token', data.access_token)
    if (data.refresh_token)
        localStorage.setItem('refresh_token', data.refresh_token)
}

const getPlayingTrack = async (): Promise<string> => {
    const payload = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const url = api_url + 'me/player/currently-playing'
    const response = await fetch(url, payload)
    const data = await response.json()

    return data.item.name
}

const main = async () => { 
    document.querySelector('#recent')!.textContent = await getPlayingTrack()
}

main()