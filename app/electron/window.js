const { ipcMain } = require('electron')

module.exports = {
    setup: win => {
        ipcMain.on("close", () => {
            win.close()
        })
        ipcMain.on("minimize", () => {
            win.minimize()
        })
        ipcMain.on("maximize", () => {
            win.maximize()
        })
    }
}