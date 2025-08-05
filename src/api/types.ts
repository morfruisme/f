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

  constructor(data: Spotify.SimpleAlbum, labels: Label[] = []) {
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
    Album.tree.update(this)
  }

  addLabels(labels: Label[]) {
    labels = labels.map(Album.label)
    this._labels.push(...labels.filter(this.labels.includes))
    this.save()
  }

  removeLabels(labels: Label[]) {
    labels = labels.map(Album.label)
    this._labels = this.labels.filter(labels.includes)
    this.save()
  }

  toString() {
    return `${this.name} - ${this.artists.map(a => a.name)} [ ${this.labels} ]`
  }
}

namespace Album {
  export const tree = new Tree<Album, Label>()

  export const album = (album: Album) => {
    const found = tree.items.get(album.id)
    return found ? found.item : album
  }

  export const label = (label: Label) => {
    const found = tree.labels.get(label.id)
    return found ? found : label
  }

  export const search = (q: string) => Spotify.search(q, 4)
    .then(albums => albums.map(a => Album.album(new Album(a))))
}

class Label {
  name: string
  color: HSLColor

  constructor(name: string, color?: HSLColor) {
    this.name = name
    this.color = color ?
      color : { h: 360 * Math.random(), s: 100 * Math.random(), l: 100 * Math.random() }
  }

  get id() {
    return this.name
  }

  toString() {
    return this.name
  }
}

type HSLColor = { h: number, s: number, l: number }

// import { Tree as Tree_ } from "./tree_old.js"

// class Tree extends Tree_<Spotify.Track, Label> {
//   // add the track with given labels (replace existing ones)
//   addTrack(track: Spotify.Track, labels: Label[]) {
//     this.add({
//       id: track.name,
//       labels: labels.map(l => ({ id: l.name, value: l })),
//       value: track
//     })
//   }

//   // add the track with given labels on top of existing ones
//   addLabels(track: Spotify.Track, labels: Label[]) {
//     const item = this.items.get(track.name)
//     labels = labels.concat(item ?
//       item.labels.map(l => l.value).filter(l => !labels.includes(l)) : [])
//     this.addTrack(track, labels)
//   }

//   // remove given labels from the track
//   removeLabels(track: Spotify.Track, labels: Label[]) {
//     const item = this.items.get(track.name)
//     if (item) {
//       labels = item.labels.filter(l =>
//         !labels.some(ll => ll.name === l.id)).map(l => l.value)
//       this.addTrack(track, labels)
//     }
//   }
// }
