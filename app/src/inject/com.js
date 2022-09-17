const { ipcRenderer } = require('electron')

document.addEventListener("click", () => {
    ipcRenderer.sendToHost("interact")
})

document.addEventListener("keydown", e => {
    if (e.key == "F12") {
        ipcRenderer.sendToHost("devtools")
    }
})