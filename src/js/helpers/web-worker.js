import { worker as MyWorker }  from '../worker';

let blob = new Blob(['(this.onmessage=', MyWorker.toString(), ')'], { type: "text/javascript" });

var worker = new Worker(window.URL.createObjectURL(blob));

worker.onmessage =  function(e) {
        
    document.getElementById('count').innerText = e.data;
    localStorage.setItem('DDWAApp_last_update_time', new Date());
    localStorage.setItem('DDWAApp_last_update_value', e.data);
};

export function start(){
    let lastUpdateDate = localStorage.getItem('DDWAApp_last_upd//ate_time')? new Date(localStorage.getItem('DDWAApp_last_update_time')) : new Date();
    let nextUpdateDate =  new Date(lastUpdateDate);
    nextUpdateDate.setMinutes(lastUpdateDate.getMinutes() + (localStorage.getItem('DDWAApp_last_update_time')? 1: 0));

    document.getElementById('count').innerText = ('' + (localStorage.getItem('DDWAApp_last_update_value')  || '' ));

    if (new Date() >= nextUpdateDate) {
        startUpdate();
    } else {
        setTimeout(startUpdate, getNextTimeStart(lastUpdateDate));
    }
};

function getNextTimeStart(datetime){
    let nextUpdate =  new Date(datetime);
    nextUpdate.setMinutes(datetime.getMinutes() + 1);

    return nextUpdate - new Date();
}
function startUpdate(){
   worker.postMessage({'cmd': 'start'});
}
