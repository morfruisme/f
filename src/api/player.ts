import { token } from './main.js'

// Load sdk script after this one
const script = document.createElement('script')
script.src = 'https://sdk.scdn.co/spotify-player.js'
document.body.appendChild(script)

window.onSpotifyWebPlaybackSDKReady = () => {
  const player = new Spotify.Player({
    name: 'f',
    getOAuthToken: cb => { cb(token); }
  })

  player.connect()
}
