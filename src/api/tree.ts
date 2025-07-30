type Node<I, L> = Inner<I, L> | Leaf<I, L>

class Leaf<I, L> {
  items: I[]
  parent: Inner<I, L> | null = null

  constructor(items: I[] = []) {
    this.items = items
  }
}

class Inner<I, L> {
  label: L
  left: Node<I, L>
  right: Node<I, L>
  parent: Inner<I, L> | null = null

  constructor(label: L, left: Node<I, L>, right: Node<I, L>) {
    this.label = label
    this.left = left
    this.left.parent = this
    this.right = right
    this.right.parent = this
  }
}

type Id<T> = (x: T) => string

export class Tree<I, L> {
  private root: Node<I, L> = new Leaf()
  private items: Map<string, Leaf<I, L>> = new Map()
  
  private iId: Id<I>
  private lId: Id<L>
  
  constructor(itemId: Id<I>, labelId: Id<L>) {
    this.iId = itemId
    this.lId = labelId
  }

  labels(leaf: Leaf<I, L>) {    
    if (!leaf.parent)
      return []

    const labels: L[] = []
    if (leaf.parent.left === leaf)
      labels.push(leaf.parent.label)
    
    let c = leaf.parent
    while (c.parent !== null) {
      if (c.parent.left === c)
        labels.push(c.parent.label)
      c = c.parent
    }
  
    return labels
  }

  has(item: I) {
    return this.items.has(this.iId(item))
  }

  remove(item: I) {
    if (this.has(item)) {
      const leaf = this.items.get(this.iId(item))!
      const i = leaf.items.findIndex(i => this.iId(i) === this.iId(item))
      leaf.items.splice(i, 1)
      return this.labels(leaf)
    }
    return []
  }
  
  add(item: I, labels: L[]) {
    labels.push(...this.remove(item))
    const seen: string[] = []
    
    const f = (node: Node<I, L>) => {
      if (node instanceof Inner) {
        if (labels.some(l => this.lId(l) === this.lId(node.label))) {
          seen.push(this.lId(node.label))
          f(node.left)
        }
        else
          f(node.right)
      }
      else {
        const newLabels = labels.filter(l => {
          const b = !seen.includes(this.lId(l))
          seen.push(this.lId(l))
          return b
        })

        if (newLabels.length === 0) {
          node.items.push(item)
          this.items.set(this.iId(item), node)
        }
        else {
          const parent = node.parent
          let leaf: Leaf<I, L> = new Leaf([item])
          this.items.set(this.iId(item), leaf)
          
          let c = new Inner(newLabels[0], leaf, node)         
          for (let i = newLabels.length-1; i > 0; i--)
            c = new Inner(newLabels[i], c, new Leaf())

          if (parent) {
            if (parent.left === node)
              parent.left = c
            else
              parent.right = c
            c.parent = parent
          }
          else
            this.root = c
        }
      }
    }

    f(this.root)
  }
  
  toString() {
    let output = ''

    const f = (node: Node<I, L>, acc: string) => {
      if (node instanceof Inner) {
        f(node.left, `${acc}${this.lId(node.label)} `)
        f(node.right, acc)
      }
      else
        output += `${acc}[ ${node.items.map(this.iId).join(', ')} ]\n`
    }

    f(this.root, '')
    return output
  }
}
