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

type Item<I, T> = {
  id: string
  value: I
  traits: Trait<T>[]
  list: Item<I, T>[] // TEMP
}

type Trait<T> = {
  id: string
  value: T
}

class Node<I, T> {
  trait: Trait<T> | null = null
  left:  Node<I, T> | null = null
  right: Node<I, T> | null = null
  items: Item<I, T>[] = []

  constructor(items: Item<I, T>[])
  constructor(trait: Trait<T>)
  constructor(v: Item<I, T>[] | Trait<T>) {
  if (v instanceof Array)
    this.items = v
  else
    this.trait = v
  }

  isInner(): this is { trait: Trait<T>, left: Node<I, T>, right: Node<I, T> } {
    return this.trait !== null
  }
}

class Tree<I, T> {
  private root = new Node<I, T>([])
  protected items:  Map<string, Item<I, T>> = new Map()
  protected traits: Map<string, Trait<T>> = new Map()

  protected addItem(item: Item<I, T>) {
    this.items.set(item.id, item)

    let seen: Map<Trait<T>, boolean> = new Map()
    item.traits.forEach(trait => seen.set(trait, false))

    const f = (node: Node<I, T>) => {
      if (node.isInner()) {
        if (item.traits.includes(node.trait)) {
          seen.set(node.trait, true)
          f(node.left)
        }
        else
          f(node.right)
      }
      else if (seen.values().every(b => b)) { // FACTOR
        node.items.push(item)
        item.list = node.items // TEMP
      }
      else {
        const not_seen = seen.entries()
          .filter(([_, b]) => !b)
          .map(([trait, _]) => {
            this.traits.set(trait.toString(), trait)
            return trait
          })
          .toArray()
  
        let c = node;
        for (let i = 1; i < not_seen.length; i++) {
          c.left = new Node(not_seen[i])
          c.right = new Node([])
          c = c.left
        }
        c.left = new Node([item])
        item.list = c.left.items
        c.right = new Node(node.items)

        node.trait = not_seen[0]
        node.items = []
      }
    }

    f(this.root)
  }

  toString() {
    let output = ''
    const f = (node: Node<I, T>, acc: string) => {
      if (node.isInner()) {
        f(node.left, `${acc}${node.trait.id} `)
        f(node.right, acc)
      }
      else
        output += `${acc}[ ${node.items.map(i => i.id).join(', ')} ]\n`
    }
    f(this.root, '')
    return output
  }
}

export class TagTree extends Tree<SimpleTrack, Tag> {
  addTrack(track: SimpleTrack, tags: Tag[]) {
    const traits = tags.map(tag => ({ id: tag.name, value: tag }))

    if (this.items.has(track.id)) {
      const item = this.items.get(track.id)!
      this.items.delete(item.id)
      item.list.splice(item.list.indexOf(item), 1) // TEMP
      item.traits.push(...traits)

      this.addItem(item)
    }
    else
      this.addItem({
        id: track.id,
        value: track,
        traits: traits,
        list: [], // TEMP ew
      })
  }
}
