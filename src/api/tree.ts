export { Tree }

// everything is checked by value, so object types should be used cautiously
class Tree<I, L> {
  private root: Node<I, L> = new Leaf()
  private items = new Map<I, Leaf<I, L>>()

  // basic search
  search(labels: L[]) {
    const found: I[] = []
    const seen = labels.map(_ => false)

    const f = (node: Node<I, L>) => {
      if (node instanceof Leaf) {
        if (seen.every(id))
          found.push(...node.items)
      }
      else {
        const i = labels.indexOf(node.label)
        if (i === -1)
          f(node.right)
        else
          seen[i] = true
        f(node.left)
      }
    }

    f(this.root)
    return found
  }

  // find items with exactly these labels
  find(labels: L[]) {
    const seen = labels.map(_ => false)

    const f = (node: Node<I, L>) => {
      if (node instanceof Leaf)
        return seen.every(id) ? node : null
      const i = labels.indexOf(node.label)
      if (i === -1)
        return f(node.right)
      seen[i] = true
      return f(node.left)
    }
    
    const leaf = f(this.root)
    return leaf ? leaf.items : []
  }

  // remove the item if it exists
  remove(item: I) {
    if (this.items.has(item)) {
      const leaf = this.items.get(item)!
      leaf.items.splice(leaf.items.indexOf(item), 1)
    }
  }

  // update the item, overwriting any existing one with same id
  update(item: I, labels: L[]) {
    this.remove(item)
    const seen = labels.map(_ => false)

    const f = (node: Node<I, L>) => {
      if (node instanceof Inner) {
        const i = labels.indexOf(node.label)
        if (i === -1)
          f(node.right)
        else {
          seen[i] = true
          f(node.left)
        }
      }
      else {
        const newLabels = labels.filter((_, i) => !seen[i]) 

        if (newLabels.length === 0)
          node.items.push(item)
        else {
          const parent = node.parent

          // create a branch
          let leaf = new Leaf<I, L>([item])
          let c = new Inner(newLabels[0], leaf, node)
          for (let i = 1; i < newLabels.length; i++)
            c = new Inner(newLabels[i], c, new Leaf())

          // merge it with the tree
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
  }

  toString() {
    let output = ""

    const f = (node: Node<I, L>, acc: string) => {
      if (node instanceof Leaf)
        output += `${acc}[ ${node.items.join(", ")} ]\n`
      else {
        f(node.left, `${acc}${node.label} `)
        f(node.right, acc)
      }
    }

    f(this.root, "")
    return output
  }
}

type Node<I, L> = Inner<I, L> | Leaf<I, L>

class Inner<I, L> {
  label: L
  left: Node<I, L>
  right: Node<I, L>
  parent: Inner<I, L> | null = null

  constructor(label: L, left: Node<I, L>, right: Node<I, L>) {
    this.label = label
    this.left = left
    this.right = right
    this.left.parent = this
    this.right.parent = this
  }
}

class Leaf<I, L> {
  items: I[]
  parent: Inner<I, L> | null = null

  constructor(items: I[] = []) {
    this.items = items
  }
}

const id = <T>(x: T) => x
