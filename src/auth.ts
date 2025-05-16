import { clientId, scope } from './config.js';

const redirectUri = 'http://[::1]:3000/auth'

const randomString = (length: number) => {
    const alnum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const values = crypto.getRandomValues(new Uint8Array(length))
    return values.reduce((acc, x) => acc + alnum[x % alnum.length], '')
}

const sha256 = (plain: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return crypto.subtle.digest('SHA-256', data)
}

const base64url = (buff: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buff)))
        .replace(/=/g, '')
        .replace(/\+/, '-')
        .replace(/\//g, '_')
}

const reqCode = async () => {
    const state = randomString(16)
    sessionStorage.setItem('state', state)

    const codeVerifier = randomString(64)
    sessionStorage.setItem('code_verifier', codeVerifier)
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64url(hashed)

    const params = {
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        state: state,
        scope: scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge
    }

   const url = new URL('https://accounts.spotify.com/authorize')
   url.search = new URLSearchParams(params).toString()
   location.href = url.toString()
}

const reqToken = async (code: string) => {
    const codeVerifier = sessionStorage.getItem('code_verifier')!

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }).toString()
    }

    const url = 'https://accounts.spotify.com/api/token'
    const response = await fetch(url, payload)
    const data = await response.json()

    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    location.href = '/?connected'
}

const main = async () => {
    const params = new URLSearchParams(location.search)
    const code = params.get('code')
    const state = params.get('state')

    if (code && state && state == sessionStorage.getItem('state')) {
        sessionStorage.removeItem('state')
        await reqToken(code)
    }
    else {
        await reqCode()
    }
}

main()