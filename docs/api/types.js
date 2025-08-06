import * as Spotify from "./spotify/wrapper.js";
import { Tree } from "./tree.js";
export { Album, Label };
class Album {
    id;
    name;
    type;
    artists;
    _labels;
    constructor(data, labels = []) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.album_type;
        this.artists = data.artists;
        this._labels = labels;
    }
    get labels() {
        return this._labels;
    }
    save() {
        if (!Album.albums.has(this.id))
            Album.albums.set(this.id, this);
        // todo
    }
    addLabels(labels) {
        this._labels.push(...labels.filter(l => !this.labels.includes(l)));
        this.save();
    }
    removeLabels(labels) {
        this._labels = this.labels.filter(labels.includes);
        this.save();
    }
    toString() {
        return `${this.name} - ${this.artists.map(a => a.name)} [ ${this.labels.join(", ")} ]`;
    }
    static albums = new Map();
    static tree = new Tree();
    static get(id) {
        const found = Album.albums.get(id);
        return found ? found : null;
    }
    static getOrNew(album) {
        const found = Album.albums.get(album.id);
        return found ? found : new Album(album);
    }
    static async search(q) {
        const albums = await Spotify.search(q, 4);
        return albums.map(Album.getOrNew);
    }
}
class Label {
    static count = 0;
    id;
    name;
    color;
    constructor(name, color) {
        this.id = Label.count++;
        this.name = name;
        this.color = color ?
            color : { h: 360 * Math.random(), s: 100 * Math.random(), l: 100 * Math.random() };
    }
    toString() {
        return `${this.name} (${this.id})`;
    }
}
