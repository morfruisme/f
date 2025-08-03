import { Tree as Tree_ } from "./tree.js";
export class Tree extends Tree_ {
    // add the track with given labels (replace existing ones)
    addTrack(track, labels) {
        this.add({
            id: track.name,
            labels: labels.map(l => ({ id: l.name, value: l })),
            value: track
        });
    }
    // add the track with given labels on top of existing ones
    addLabels(track, labels) {
        const item = this.items.get(track.name);
        labels = labels.concat(item ?
            item.labels.map(l => l.value).filter(l => !labels.includes(l)) : []);
        this.addTrack(track, labels);
    }
    // remove given labels from the track
    removeLabels(track, labels) {
        const item = this.items.get(track.name);
        if (item) {
            labels = item.labels.filter(l => !labels.some(ll => ll.name === l.id)).map(l => l.value);
            this.addTrack(track, labels);
        }
    }
}
