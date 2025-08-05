type Node = Inner | Leaf

class Leaf {
  items: string[]
  parent: Inner | null = null

  constructor(items: string[] = []) {
    this.items = items
  }
}

class Inner {
  label: string
  left:  Node
  right: Node
  parent: Inner | null = null

  constructor(label: string, left: Node, right: Node) {
    this.label = label
    this.left = left
    this.right = right
    this.left.parent = this
    this.right.parent = this
  }
}

type Item<I, L> = {
  id: string
  labels: Label<L>[]
  value: I
}

type Label<L> = {
  id: string
  value: L
}

export class Tree<I, L> {
  private root: Node = new Leaf() 
  protected items = new Map<string, Item<I, L>>()
  protected labels = new Map<string, Label<L>>()

  protected add(item: Item<I, L>) {
    this.remove(item.id)
    this.items.set(item.id, item)
 
    const seen: string[] = []
    const f = (node: Node) => {
      if (node instanceof Inner) {
        if (item.labels.some(l => l.id === node.label)) {
          seen.push(node.label)
          f(node.left)
        }
        else
          f(node.right)
      }
      else {
        const newLabels = item.labels.filter(l => !seen.includes(l.id))
        newLabels.forEach(l => this.labels.set(l.id, l))

        if (newLabels.length === 0)
          node.items.push(item.id)
        else {
          const parent = node.parent
          let leaf = new Leaf([item.id])
          
          let c = new Inner(newLabels[0].id, leaf, node)
          for (let i = 1; i < newLabels.length; i++)
            c = new Inner(newLabels[i].id, c, new Leaf())

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

  search(labels: string[]) {
    const items: I[] = []
    const seen = labels.map(_ => false)
    
    const f = (node: Node) => {
      if (node instanceof Leaf) {
        if (seen.every(b => b))
          items.push(...node.items.map(i => this.items.get(i)!.value))
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
    return items
  }

  private findLeaf(labels: string[]) {
    const seen = labels.map(_ => false)

    const f = (node: Node) => {
      if (node instanceof Leaf)
        return seen.every(b => b) ? node : null
      const i = labels.indexOf(node.label)
      if (i !== -1) {
        seen[i] = true
        return f(node.left)
      }
      return f(node.right)
    }

    return f(this.root)
  }

  protected find(labels: string[]) {
    const leaf = this.findLeaf(labels)
    return leaf ? leaf.items : []
  }

  protected remove(item: string) {
    if (this.items.has(item)) {
      const leaf = this.findLeaf(this.items.get(item)!.labels.map(l => l.id))!
      leaf.items.splice(leaf.items.indexOf(item), 1)
    }
  }

  toString() {
    let output = ""

    const f = (node: Node, acc: string) => {
      if (node instanceof Inner) {
        f(node.left, `${acc}${node.label} `)
        f(node.right, acc)
      }
      else
        output += `${acc}[ ${node.items.join(", ")} ]\n`
    }

    f(this.root, "")
    return output
  }
}