const { app, BrowserWindow, webContents, ipcMain  } = require('electron')
const path = require('path')
const window = require("./electron/window")


function createWindow () {
  const win = new BrowserWindow({
    width: 1600,
    height: 800,
    frame: false,
    transparent: false,
    webPreferences: {
      webviewTag: true,
      sandbox: false,
      preload: path.join(__dirname, './electron/preload.js'),
      contextIsolation: false
    }
  })

  //setup listeners
  window.setup(win)

  //move to second screen
  win.setPosition(2000, 100)

  //dev tools
  win.webContents.openDevTools({mode: "right"})

  //open url
  win.loadURL(`http://localhost:3000/`)
}


app.whenReady().then(async () => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('devtools-enable', (e, data) => {
  const target = webContents.fromId(data.view)
  const devtools = webContents.fromId(data.devtools)
  target.setDevToolsWebContents(devtools)
  target.openDevTools()
  devtools.executeJavaScript("window.location.reload()");
})