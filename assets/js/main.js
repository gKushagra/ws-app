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
    if ('msg' in _data)
        document.getElementById('message').innerHTML = _data['msg'];
    else if ('clientId' in _data)
        {}// document.getElementById('message').innerHTML = _data.clientId;
    else if ('searchResults' in _data)
        searchResults(_data['searchResults']);
    else if ('pairs' in _data)
        showContacts(_data['pairs']);
}

// document.getElementById('send-msg').addEventListener('click', () => {
//     socket.send(JSON.stringify({ requestCode: 1, msg: "Hello again from client" }));
// });

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', () => {
    if (searchInput.value && searchInput.value != " ") {
        socket.send(JSON.stringify({ requestCode: 2, search: searchInput.value }));
    } else {
        if (document.getElementById('search').querySelector('#search-results'))
            document.getElementById('search')
                .removeChild(document.getElementById('search').querySelector('#search-results'));
    }
})

function searchResults(data) {
    console.log(data);
    let searchDiv = document.getElementById('search');
    if (searchDiv.querySelector('#search-results'))
        searchDiv.removeChild(searchDiv.querySelector('#search-results'));
    const searchResultsDiv = document.createElement('div');
    searchResultsDiv.style.display = 'none';
    searchResultsDiv.setAttribute('id', 'search-results');
    searchResultsDiv.classList.add('search__results');
    let results = [];
    for (let i = 0; i < data.length; i++) {
        console.log('here');
        let el = document.createElement('div');
        el.innerHTML = data[i].name;
        el.setAttribute('id', `search-result-${i}`);
        results[i] = el;
        results[i].addEventListener('click', () => {
            addPair(data[i]);
        });
        console.log(el);
        searchResultsDiv.appendChild(el);
        searchDiv.appendChild(searchResultsDiv);
    }
    console.log(searchResultsDiv);
    searchResultsDiv.style.display = 'block';
}

function addPair(pair) {
    console.log(pair);
    let user = JSON.parse(document.getElementById('user').dataset.user);
    socket.send(JSON.stringify({ requestCode: 3, user, pair }));
}

function showContacts(data) {
    let contactsDiv = document.getElementById('contacts');
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        let contact = document.createElement('div');
        contact.setAttribute('id', `contact-${i}`);
        contact.innerHTML = data[i].name;
        contact.addEventListener('click', () => {
            console.log(data[i]);
        });
        contactsDiv.appendChild(contact);
    }
}