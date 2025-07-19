export type Track = {
  name: string,
  id: string,
  tags: Tag[],
}

export type Tag = {
  name: string,
}

type Inner = {
  tag:   Tag,
  right: Node,
  left:  Node,
}

export class Node {
  tag:    Tag | null = null
  left:  Node | null = null
  right: Node | null = null
  tracks: Track[] = []

  constructor(tag: Tag)
  constructor(tracks: Track[])
  constructor(v: Tag | Track[]) {
    if (v instanceof Array)
      this.tracks = v
    else
      this.tag = v
  }

  isInner(): this is Inner {
    return this.tag !== null
  }
}

export class Tree {
  root = new Node([])

  addTrack(track: Track) {
    let seen: Map<Tag, boolean> = new Map()
    track.tags.forEach(tag => seen.set(tag, false))
    
    const f = (node: Node) => {
      if (node.isInner()) {
        // left are tracks with the tag
        if (track.tags.includes(node.tag)) {
          seen.set(node.tag, true)
          f(node.left)
        }
        else
          f(node.right)
      }
      // if the track has no new tag
      else if (seen.values().every(b => b)) {
        node.tracks.push(track)
      }
      // else add the tags to the tree
      else {
        const not_seen = seen.entries()
          .filter(([_, b]) => !b)
          .map(([tag, _]) => tag)
          .toArray()
        
        let c = node;
        for (let i = 1; i < not_seen.length; i++) {
          c.left = new Node(not_seen[i])
          c.right = new Node([])
          c = c.left
        }
        c.left = new Node([track])
        c.right = new Node(node.tracks)

        node.tag = not_seen[0]
        node.tracks = []
      }
    }
    
    f(this.root)
  }

  toString() {
    let output = ''
    const f = (node: Node, acc: string) => {
      if (node.isInner()) {
        f(node.left, `${acc}${node.tag.name} `)
        f(node.right, acc)
      }
      else
        output += `${acc}[ ${node.tracks.map(track => track.name).join(', ')} ]\n`
    }
    f(this.root, '')
    return output
  }
}
