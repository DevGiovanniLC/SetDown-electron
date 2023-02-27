const { ipcRenderer} = require('electron');
ipc =  ipcRenderer


let alert = document.getElementById("alert");
alert.addEventListener("click", ()=> {
    ipc.send('cancel')
})
