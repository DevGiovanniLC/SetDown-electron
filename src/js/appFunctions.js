const { ipcRenderer} = require('electron')
const ipc = ipcRenderer;
const {exec} = require('child_process');

let quitButton = document.getElementById("quitButton");
let minimizeButton = document.getElementById("minimizeButton");
let acceptButton = document.getElementById("accept");
let cancelButton = document.getElementById("cancel");
let counter = document.querySelector("#count");
let clock = document.getElementById("clock");


quitButton.addEventListener("click", ()=> {
    ipc.send('close')
})

minimizeButton.addEventListener("click", ()=> {
    ipc.send('minimize')
})

acceptButton.addEventListener("click", ()=> {
    clock.src = "../assets/icon4.png";
    time = validate();
    console.log(time);
    ipc.send("accept", time);
})

cancelButton.addEventListener("click", ()=> {
  ipc.send('cancel');
  counter.textContent = "00:00:00";
  clock.src = "../assets/icon3.png";
})

ipc.on('updateCount', (event, string) => {
    counter.textContent = string;
  if(string == "00:10:00"){
    clock.src = "../assets/icon5.png";
  }
})

ipc.on('cancel', ()=> {
    counter.textContent = "00:00:00";
    clock.src = "../assets/icon3.png";
});

function validate(){
    var radio = document.getElementsByName('selection');
    for(i=0;i<radio.length;i++){
        if(radio[i].checked){
            return radio[i].value;
        }
    }
}