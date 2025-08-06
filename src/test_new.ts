import { Album, Label } from "./api/types.js"

const search = document.querySelector("div")!
const searchInput: HTMLInputElement = search.querySelector("input")!
const searchResult = search.querySelector(".result")!

searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    [...searchResult.childNodes].forEach(child => child.remove())
    Album.search(searchInput.value.trim())
      .then(albums => albums.forEach(addAlbumResult))
  }
})

const addAlbumResult = (album: Album) => {
  const p = document.createElement("p")
  p.textContent = album.toString()
  searchResult.appendChild(p)
}

Album.search("jane remover")
  .then(albums => {
    const a = albums
      .find(a => a.name.toLowerCase() === "revengeseekerz")!
    a.addLabels([new Label("jane"), new Label("jane")])
  })