const {ipcRenderer} = require("electron")

window.send = (channel, data) => {
    ipcRenderer.send(channel, data)
}