const { app, BrowserWindow, webContents, ipcMain  } = require('electron')
const isDev = require('electron-is-dev');
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
      contextIsolation: false,
    }
  })
  //setup listeners
  window.setup(win)

  //check for dev mode
  if (isDev) {
    //dev tools
    win.webContents.openDevTools({mode: "right"})

    //load dev app
    win.loadURL("http://localhost:3000")

    //move to second screen
    win.setPosition(2000, 100)
  }

  if (!isDev) {
    //load build
    win.loadURL(`file://${path.join(__dirname, './static/index.html')}`)
  }
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