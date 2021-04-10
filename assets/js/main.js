const socket = new WebSocket('ws://localhost:6868/');

socket.onopen = function () {
    console.log('socket open');

    setTimeout(() => {
        let user = JSON.parse(document.getElementById('user').dataset.user);

        socket.send(JSON.stringify({ requestCode: 0, user }));
    }, 1000);

}

socket.onmessage = function ({ data }) {
    let _data = JSON.parse(data);
    console.log(`Message from server ${_data}`);
    document.getElementById('message').innerHTML = _data.clientId;
}

