import { search } from './api/main.js'
import { Track, Node, Tree } from './api/tag.js'

const tag_a = { name: '#A' }
const tag_b = { name: '#B' }
const tag_c = { name: '#C' }

let tree = new Tree()
let track: Track | null = null

const result = document.querySelector('#result')!
const input = document.querySelector('input')!
input.addEventListener('keypress', async e => {
  if (e.key === 'Enter') {
    const rTrack = await search(input.value)
    if (rTrack) {
      track = {
        name: rTrack.name,
        id: rTrack.id,
        tags: [],
      }
      result.textContent = `${rTrack.name} - ${rTrack.artists.join(', ')}`
    }
  }
})

const treeLog = document.querySelector('#tree')!
treeLog.innerHTML = tree.toString().replace(/\n/g, '<br>')

const add = document.querySelector('button')!
add.addEventListener('click', () => {
  if (track) {
    tree.addTrack(track)
    treeLog.innerHTML = tree.toString().replace(/\n/g, '<br>')
  }
})
