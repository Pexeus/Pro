const { ipcRenderer } = require('electron')

document.addEventListener("click", () => {
    console.log("click");
    ipcRenderer.sendToHost("interact")
})