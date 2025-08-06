import * as Spotify from "./spotify/wrapper.js"
import { Tree } from "./tree.js"

export { Album, Label }

const enum AlbumType { Album = "album", EP = "compilation", Single = "single" }

class Album {
  id: string
  name: string
  type: AlbumType
  artists: Spotify.SimpleArtist[]

  private _labels: Label[]

  private constructor(data: Spotify.SimpleAlbum, labels: Label[] = []) {
    this.id = data.id
    this.name = data.name
    this.type = data.album_type as AlbumType
    this.artists = data.artists

    this._labels = labels
  }

  get labels(): readonly Label[] {
    return this._labels
  }

  save() {
    if (!Album.albums.has(this.id))
      Album.albums.set(this.id, this)
    // todo
  }

  addLabels(labels: Label[]) {
    this._labels.push(...labels.filter(l => !this.labels.includes(l)))
    this.save()
  }

  removeLabels(labels: Label[]) {
    this._labels = this.labels.filter(labels.includes)
    this.save()
  }

  toString() {
    return `${this.name} - ${this.artists.map(a => a.name)} [ ${this.labels.join(", ")} ]`
  }



  private static albums = new Map<string, Album>()
  private static tree = new Tree<string, Label>() 

  static get(id: string) {
    const found = Album.albums.get(id)
    return found ? found : null
  }

  static getOrNew(album: Spotify.SimpleAlbum) {
    const found = Album.albums.get(album.id)
    return found ? found : new Album(album)
  }

  static async search(q: string) {
    const albums = await Spotify.search(q, 4)
    return albums.map(Album.getOrNew)
  }
}

class Label {
  static count = 0

  readonly id: number
  name: string
  color: HSLColor

  constructor(name: string, color?: HSLColor) {
    this.id = Label.count++
    this.name = name
    this.color = color ?
      color : { h: 360 * Math.random(), s: 100 * Math.random(), l: 100 * Math.random() }
  } 

  toString() {
    return `${this.name} (${this.id})`
  }
}

type HSLColor = { h: number, s: number, l: number }