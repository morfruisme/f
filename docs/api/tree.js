class Leaf {
    items;
    parent = null;
    constructor(items = []) {
        this.items = items;
    }
}
class Inner {
    label;
    left;
    right;
    parent = null;
    constructor(label, left, right) {
        this.label = label;
        this.left = left;
        this.right = right;
        this.left.parent = this;
        this.right.parent = this;
    }
}
export class Tree {
    root = new Leaf();
    items = new Map();
    labels = new Map();
    add(item) {
        this.remove(item.id);
        this.items.set(item.id, item);
        const seen = [];
        const f = (node) => {
            if (node instanceof Inner) {
                if (item.labels.some(l => l.id === node.label)) {
                    seen.push(node.label);
                    f(node.left);
                }
                else
                    f(node.right);
            }
            else {
                const newLabels = item.labels.filter(l => !seen.includes(l.id));
                newLabels.forEach(l => this.labels.set(l.id, l));
                if (newLabels.length === 0)
                    node.items.push(item.id);
                else {
                    const parent = node.parent;
                    let leaf = new Leaf([item.id]);
                    let c = new Inner(newLabels[0].id, leaf, node);
                    for (let i = 1; i < newLabels.length; i++)
                        c = new Inner(newLabels[i].id, c, new Leaf());
                    if (parent) {
                        if (parent.left === node)
                            parent.left = c;
                        else
                            parent.right = c;
                        c.parent = parent;
                    }
                    else
                        this.root = c;
                }
            }
        };
        f(this.root);
    }
    search(labels) {
        const items = [];
        const seen = labels.map(_ => false);
        const f = (node) => {
            if (node instanceof Leaf) {
                if (seen.every(b => b))
                    items.push(...node.items.map(i => this.items.get(i).value));
            }
            else {
                const i = labels.indexOf(node.label);
                if (i === -1)
                    f(node.right);
                else
                    seen[i] = true;
                f(node.left);
            }
        };
        f(this.root);
        return items;
    }
    findLeaf(labels) {
        const seen = labels.map(_ => false);
        const f = (node) => {
            if (node instanceof Leaf)
                return seen.every(b => b) ? node : null;
            const i = labels.indexOf(node.label);
            if (i !== -1) {
                seen[i] = true;
                return f(node.left);
            }
            return f(node.right);
        };
        return f(this.root);
    }
    find(labels) {
        const leaf = this.findLeaf(labels);
        return leaf ? leaf.items : [];
    }
    remove(item) {
        if (this.items.has(item)) {
            const leaf = this.findLeaf(this.items.get(item).labels.map(l => l.id));
            leaf.items.splice(leaf.items.indexOf(item), 1);
        }
    }
    toString() {
        let output = "";
        const f = (node, acc) => {
            if (node instanceof Inner) {
                f(node.left, `${acc}${node.label} `);
                f(node.right, acc);
            }
            else
                output += `${acc}[ ${node.items.join(", ")} ]\n`;
        };
        f(this.root, "");
        return output;
    }
}
