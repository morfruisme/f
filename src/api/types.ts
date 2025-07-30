type Item = {
  type: "album" | "artist" | "track"
  id: string
  name: string
}

export type Track = Item & {
  type: "track"
  duration_ms: number
  explicit: boolean
  artists: SimpleArtist[]
  
  album: Album
  disc_number: number
  track_number: number
}

export type Album = Item & {
  type: "album"
  album_type: "album" | "compilation" | "single"
  total_tracks: number
  images: Image[]
  artists: SimpleArtist[]
}

export type SimpleArtist = Item & {
  type: "artist"
}

export type Artist = SimpleArtist & {
  images: Image[]
}

export type Image = {
  url: string
  width: number
  height: number
}

export type PlaybackState = {
  is_playing: boolean
  progress_ms: number
  item: Track | null
}
