import { Tree } from './tree.js'

export type SimpleTrack = {
    id: string
    name: string
    artists: string[]
}

export type Track = SimpleTrack & {
    album: string
    cover: string
    duration_ms: number
}

export type PlayingTrack = Track & {
    progress_ms: number
}

export type Tag = {
  name: string
}

export class TrackTree extends Tree<SimpleTrack, Tag> {
  constructor() {
    super(track => track.name, tag => tag.name)
  }
}
