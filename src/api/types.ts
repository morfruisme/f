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



import { Tree as Tree_ } from "./tree.js"

export type Label = {
  name: string
}

export class Tree extends Tree_<Track, Label> {
  // add the track with given labels (replace existing ones)
  addTrack(track: Track, labels: Label[]) {
    this.add({
      id: track.name,
      labels: labels.map(l => ({ id: l.name, value: l })),
      value: track
    })
  }

  // add the track with given labels on top of existing ones
  addLabels(track: Track, labels: Label[]) {
    const item = this.items.get(track.name)
    labels = labels.concat(item ? 
      item.labels.map(l => l.value).filter(l => !labels.includes(l)) : [])
    this.addTrack(track, labels) 
  }

  // remove given labels from the track
  removeLabels(track: Track, labels: Label[]) {
    const item = this.items.get(track.name)
    if (item) {
      labels = item.labels.filter(l => 
        !labels.some(ll => ll.name === l.id)).map(l => l.value)
      this.addTrack(track, labels)
    }
  }
}