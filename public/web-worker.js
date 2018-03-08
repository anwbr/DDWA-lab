addEventListener('message', function(e) {
    var data = e.data;
    switch (data.cmd) {
      case 'start':
      setInterval(()=>{
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'http://localhost:3000/scopes' + '?_end=0', true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            postMessage(xhr.getResponseHeader('X-Total-Count'));
        };

        xhr.send();
    }, 60000);
        break;
    };
  }, false);