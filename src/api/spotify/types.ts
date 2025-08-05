export { SimpleTrack, Track, SimpleAlbum, Album, SimpleArtist, Artist, Image, PlaybackState }
type Item = {
  type: "album" | "artist" | "track"
  id: string
  name: string
}

type SimpleTrack = Item & {
  type: "track"
  duration_ms: number
  explicit: boolean
  artists: SimpleArtist[]

  disc_number: number
  track_number: number
}

type Track = SimpleTrack & {
  album: Album
}

type SimpleAlbum = Item & {
  type: "album"
  album_type: "album" | "compilation" | "single"
  total_tracks: number
  images: Image[]
  artists: SimpleArtist[]
}

type Album = SimpleAlbum & {
  tracks: { items: SimpleTrack[] }
}

type SimpleArtist = Item & {
  type: "artist"
}

type Artist = SimpleArtist & {
  images: Image[]
}

type Image = {
  url: string
  width: number
  height: number
}

type PlaybackState = {
  is_playing: boolean
  progress_ms: number
  item: Track | null
}
