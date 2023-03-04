const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const {exec} = require('child_process');
const ipc = ipcMain;
let alert;
let win;
let time;
let tray = null
let intervalo;

function createWindow () {
  
  win = new BrowserWindow({
    width: 600,
    height: 600,
    resizable: false,
    frame: false,
    icon: 'assets/icon.ico',
    skipTaskbar: true,
    webPreferences: {
      
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('src/index.html')

  ipc.on('close', () => {
    app.quit();
  });

  ipc.on('minimize', () => {
    win.hide();
  });

  ipc.on('alert', () => {
    if(alert == undefined || alert != null){
      createAlert();
    }
  });
}

function createAlert(){
  alert = new BrowserWindow({
    width: 133,
    height: 136,
    resizable: false,
    frame: false,
    skipTaskbar: true,
    transparent: true,
    alwaysOnTop: true,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  alert.setPosition(0,0);

  alert.loadFile('src/alert.html');
  
}


function trayIcon(){
  const iconPath = path.join(__dirname, 'assets/icon2.png')

  const trayIcon = nativeImage.createFromPath(iconPath)

  tray = new Tray(trayIcon);

  tray.on('click', () =>{
    win.show()
  });

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => {
      win.show()
    }},
    { label: 'Quit', click: () => {
      
      app.quit()
    }}
  ]);

  tray.setContextMenu(contextMenu);

  tray.setToolTip("SetDown");
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('ready', () => {
  trayIcon();
})

ipc.on('cancel', () => {
  if(alert != undefined & alert != null){
    alert.close()
    alert = null;
  }
  win.webContents.send('cancel');
  clearInterval(intervalo);
});

ipc.on('accept', (event, arg) => {
  time = arg;
  clearInterval(intervalo);
  intervalo = setInterval(updateCount, 985);
});




function updateCount() {
  time--;
  string = secondsToString();
  win.webContents.send('updateCount', string);
  tray.setToolTip(string);
  if (time === 0) {

    exec("shutdown -s -t 0", (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
  }
  if(time == 600){
    createAlert();
  }
}


function secondsToString(){
  const hours = ~~(time / 3600);
  const minutes = ~~((time % 3600)/60);
  const seconds = ((time % 3600)%60);
  let fecha = new Date(0,0,0,hours, minutes, seconds);
  return fecha.toTimeString().slice(0,8)
}