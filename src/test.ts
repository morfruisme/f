// import { search, getTrack, addLabels, removeLabels, displayTree, searchTracks } from "./api/main.js"
// import { Track, Label } from "./api/types.js"
// 
// const searchInput: HTMLInputElement = document.querySelector("#search-input")!
// const searchResult = document.querySelector("#search-result")!
// let selectedTrack: Track | null = null
// 
// searchInput.addEventListener("keypress", async e => {
//   if (e.key === "Enter") {
//     [...searchResult.childNodes].forEach(child => child.remove())
//     search(searchInput.value.trim(), 5)
//       .then(tracks => tracks.forEach(t => addTrackResult(getTrack(t))))
//   }
// })
// 
// const addTrackResult = (track: Track) => {
//   const p = document.createElement("p")
//   p.textContent = track.toString()
//   p.addEventListener("click", e => {
//     selectedTrack = track
//     moveLabelMenu(e.x, e.y)
//   })
//   searchResult.appendChild(p)
// }
// 
// const treeP = document.querySelector("#tree")!
// const updateTreeP = () => treeP.innerHTML = displayTree().replace(/\n/g, "<br>")
// 
// updateTreeP()
// 
// const labelSearch: HTMLInputElement = document.querySelector("#label-search")!
// const labelResult = document.querySelector("#label-result")!
// 
// labelSearch.addEventListener("keypress", e => {
//   if (e.key === "Enter") {
//     const tracks = searchTracks(labelSearch.value.split("&")
//       .map(l => new Label(l.trim())))
//     labelResult.textContent = `[ ${tracks.join(", ")} ]`
//   }
// })
// 
// const labelMenu: HTMLDivElement = document.querySelector("#label-menu")!
// const labelInput: HTMLInputElement = document.querySelector("#label-menu > input")!
// 
// labelInput.addEventListener("keypress", e => {
//   if (e.key === "Enter" && labelInput.value.trim() !== "") {
//     const label = new Label(labelInput.value.trim())
//     labelInput.value = ""
//     addLabelOption(label)
//     selectedTrack!.labels.push(label)
//     // tree.add(selectedTrack!)
//     updateTreeP()
//   }
// })
// 
// const addLabelOption = (label: Label) => {
//   const div = document.createElement("div")
//   div.style.backgroundColor = randomHSLColor()
// 
//   const p = document.createElement("p")
//   p.textContent = label.name
//   p.classList.add("option")
//   p.addEventListener("click", () => {
//     selectedTrack!.labels.push(label)
//     // tree.add(selectedTrack!)
//     updateTreeP()
//   })
// 
//   const x = document.createElement("p")
//   x.textContent = "X"
//   x.classList.add("x")
//   x.addEventListener("click", () => {
//     // todo tree.removeLabels(selectedTrack!, [label])
//     updateTreeP()
//   })
// 
//   div.appendChild(p)
//   div.appendChild(x)
//   labelMenu.appendChild(div)
// }
// 
// const moveLabelMenu = (x: number, y: number) => {  
//   labelMenu.style.display = "block"
//   labelMenu.style.left = `${x}px`
//   labelMenu.style.top = `${y}px`
// 
//   labelInput.value = ""
//   labelInput.focus()
// 
//   triggerOnce("click", e => {
//     const target = e.target! as Element
//     if ((target === searchResult || !searchResult.contains(target))
//     && !labelMenu.contains(target)) {
//       labelMenu.style.display = "none"
//       return true
//     }
//     return false
//   })
// 
//   triggerOnce("keydown", e => {
//     if (e.key === "Escape") {
//       labelMenu.style.display = "none"
//       return true
//     }
//     return false
//   })
// }
// 
// const triggerOnce = <K extends keyof DocumentEventMap, E = DocumentEventMap[K]>
// (type: K, listener: (e: E) => boolean) => {
//   const f = (e: Event) => {
//     if (listener(e as E))
//       document.removeEventListener(type, f)
//   }
//   document.addEventListener(type, f)
// }
// 
// const randomHSLColor = () =>
//   `hsl(${360 * Math.random()}, ${100 * Math.random()}%, ${60 + 40 * Math.random()}%)`
// 