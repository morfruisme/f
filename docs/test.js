import { search } from "./api/main.js";
import { Tree } from "./api/types.js";
const searchInput = document.querySelector("#search-input");
const searchResult = document.querySelector("#search-result");
let selectedTrack = null;
searchInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
        [...searchResult.childNodes].forEach(child => child.remove());
        search(searchInput.value.trim(), 5).then(track => track.forEach(addTrackResult));
    }
});
const addTrackResult = (track) => {
    const p = document.createElement("p");
    p.textContent = `${track.name} - ${track.artists.map(a => a.name).join(", ")}`;
    p.addEventListener("click", e => {
        selectedTrack = track;
        moveLabelMenu(e.x, e.y);
    });
    searchResult.appendChild(p);
};
const treeP = document.querySelector("#tree");
const updateTreeP = (tree) => treeP.innerHTML = tree.toString().replace(/\n/g, "<br>");
const tree = new Tree();
updateTreeP(tree);
const labelSearch = document.querySelector("#label-search");
const labelResult = document.querySelector("#label-result");
labelSearch.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        const tracks = tree.search(labelSearch.value.split("&").map(l => l.trim()));
        labelResult.textContent = `[ ${tracks.map(t => t.name).join(", ")} ]`;
    }
});
const labelMenu = document.querySelector("#label-menu");
const labelInput = document.querySelector("#label-menu > input");
labelInput.addEventListener("keypress", e => {
    if (e.key === "Enter" && labelInput.value.trim() !== "") {
        const label = { name: labelInput.value.trim() };
        labelInput.value = "";
        addLabelOption(label);
        tree.addLabels(selectedTrack, [label]);
        updateTreeP(tree);
    }
});
const addLabelOption = (label) => {
    const div = document.createElement("div");
    div.style.backgroundColor = randomHSLColor();
    const p = document.createElement("p");
    p.textContent = label.name;
    p.classList.add("option");
    p.addEventListener("click", () => {
        tree.addLabels(selectedTrack, [label]);
        updateTreeP(tree);
    });
    const x = document.createElement("p");
    x.textContent = "X";
    x.classList.add("x");
    x.addEventListener("click", () => {
        tree.removeLabels(selectedTrack, [label]);
        updateTreeP(tree);
    });
    div.appendChild(p);
    div.appendChild(x);
    labelMenu.appendChild(div);
};
const moveLabelMenu = (x, y) => {
    labelMenu.style.display = "block";
    labelMenu.style.left = `${x}px`;
    labelMenu.style.top = `${y}px`;
    labelInput.value = "";
    labelInput.focus();
    triggerOnce("click", e => {
        const target = e.target;
        if ((target === searchResult || !searchResult.contains(target))
            && !labelMenu.contains(target)) {
            labelMenu.style.display = "none";
            return true;
        }
        return false;
    });
    triggerOnce("keydown", e => {
        if (e.key === "Escape") {
            labelMenu.style.display = "none";
            return true;
        }
        return false;
    });
};
const triggerOnce = (type, listener) => {
    const f = (e) => {
        if (listener(e))
            document.removeEventListener(type, f);
    };
    document.addEventListener(type, f);
};
const randomHSLColor = () => `hsl(${360 * Math.random()}, ${100 * Math.random()}%, ${60 + 40 * Math.random()}%)`;
addLabelOption({ name: "test" });
