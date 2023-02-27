const { ipcRenderer} = require('electron')
const ipc = ipcRenderer;
const { exec } = require("child_process");

let quitButton = document.getElementById("quitButton");
let minimizeButton = document.getElementById("minimizeButton");
let acceptButton = document.getElementById("accept");
let cancelButton = document.getElementById("cancel");
let counter = document.querySelector("#count");
let clock = document.getElementById("clock");
let intervalo;
let time = 0;


quitButton.addEventListener("click", ()=> {
    ipc.send('close')
})

minimizeButton.addEventListener("click", ()=> {
    ipc.send('minimize')
})

acceptButton.addEventListener("click", async ()=> {
    clock.src = "../assets/icon4.png";
    clearInterval(intervalo);
    time = validate()
    intervalo = setInterval(updateCount, 1000);
})

cancelButton.addEventListener("click", ()=> {
  cancel();
  ipc.send('cancel');
})

ipc.on('cancel', () => {
  cancel();
})


function validate(){
    var radio = document.getElementsByName('selection');
    for(i=0;i<radio.length;i++){
        if(radio[i].checked){
            return radio[i].value;
        }
    }
}

function updateCount() {
  time--;

  counter.textContent = secondsToString();

  if (time === 0) {
    clearInterval(intervalo);

    alert("Please");

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
    clock.src = "../assets/icon5.png";

    ipc.send('alert')
  }
}

function secondsToString(){
    const hours = ~~(time / 3600);
    const minutes = ~~((time % 3600)/60);
    const seconds = ((time % 3600)%60);

    let fecha = new Date(0,0,0,hours, minutes, seconds);

    return fecha.toTimeString().slice(0,8)
}

function cancel(){
  clearInterval(intervalo);

  counter.textContent = "00:00:00";
  
  clock.src = "../assets/icon3.png";
}