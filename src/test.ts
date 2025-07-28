import { search } from './api/main.js'
import { Tag } from './api/tag.js'
import { SimpleTrack, TagTree } from './api/types.js'

const searchInput = document.querySelector('#search')! as HTMLInputElement
const searchResult = document.querySelector('#result')!

const treeP = document.querySelector('#tree')!

const tagMenu: HTMLDivElement = document.querySelector('#tag-dialog')!
const tagInput: HTMLInputElement = document.querySelector('#tag-dialog > input')!

let selectedTrack: SimpleTrack | null = null
const tree = new TagTree()
treeP.innerHTML = tree.toString().replace(/\n/g, '<br>')

searchInput.addEventListener('keypress', async e => {
  if (e.key === 'Enter') {
    [...searchResult.childNodes].forEach(child => child.remove())
    search(searchInput.value, 5).then(track => track.forEach(createTrackResult))
  }
})

const createTrackResult = (track: SimpleTrack) => {
  const p = document.createElement('p')
  p.textContent = `${track.name} - ${track.artists.join(', ')}`
  p.addEventListener('click', e => {
    selectedTrack = track
    moveTagDialog(e.x, e.y)
  })
  searchResult.appendChild(p)
}

const moveTagDialog = (x: number, y: number) => {  
  tagMenu.style.display = 'block'
  tagMenu.style.left = `${x}px`
  tagMenu.style.top = `${y}px`

  tagInput.value = ''
  tagInput.focus()

  const f = (e: Event) => {
    const target = e.target! as Element
    if ((target === searchResult || !searchResult.contains(target))
    && !tagMenu.contains(target)) {
      tagMenu.style.display = 'none'
      return true
    }
    return false
  }

  const g = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      tagMenu.style.display = 'none'
      return true
    }
    return false
  }
  
  triggerOnce('click', f)
  triggerOnce('keydown', g)
}

const triggerOnce = <K extends keyof DocumentEventMap, E = DocumentEventMap[K]>
(type: K, listener: (e: E) => boolean) => {
  const f = (e: Event) => {
    if (listener(e as E))
      document.removeEventListener(type, f)
  }
  document.addEventListener(type, f)
}

tagInput.addEventListener('keypress', e => {
  if (e.key === 'Enter' && tagInput.value.trim() !== '') {
    const tag = { name: tagInput.value.trim() }
    tagInput.value = ''
    createTagP(tag)
    tree.addTrack(selectedTrack!, [tag])
    treeP.innerHTML = tree.toString().replace(/\n/g, '<br>')
  }
})

const createTagP = (tag: Tag) => {
  const p = document.createElement('p')
  p.textContent = tag.name
  p.addEventListener('click', _ => {
    tree.addTrack( selectedTrack!, [tag])
    treeP.innerHTML = tree.toString().replace(/\n/g, '<br>')
  })
  tagMenu.appendChild(p)
}
