

import { loadGamesPage } from './pages/games.mjs';
import { loadProfilePage } from './pages/profile.mjs';
import {loadFriendsPage, setupFriendsSearch, handleFriendsSearchResults } from './pages/friends.mjs';

const homeContainer = document.getElementById('home-container');
const gameContainer = document.getElementById('game-container');
const connectionnotification = document.getElementById('notification');


class PersonalInfo {
    constructor(name, username, image, header, userid) {
        this.name = name;
        this.username = username;
        this.image = image;
        this.header = header;
        this.userid = userid;
    }}

let websocket;
let user = new PersonalInfo(null,null, null, null, new URLSearchParams(window.location.search).get('userid'));


export function showNotif(text) {
    document.getElementById('notification').innerHTML = `<p>${text}</p>`;
    connectionnotification.style.display = 'block';
}

export function hideNotif() {
    connectionnotification.style.display = 'none';
}

function connectWebSocket() {
    websocket = new WebSocket(`ws://localhost:80/ws/${user.userid}`);
    // websocket = new WebSocket(`ws://49.12.97.130:80/ws/${userId}`);

    websocket.onopen = function () {
        hideNotif();
    };

    websocket.onerror = function () {
        showNotif('Connection lost duo to error. Reconnecting...');
    };

    websocket.onclose = function () {
        showNotif('Connection lost. Reconnecting...');
        setTimeout(connectWebSocket, 1000);
    };

    websocket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data.action === "friends-search") {
            handleFriendsSearchResults(websocket, data.data);
        } else if (data.action === "user-info") {
            user.name = data.data.name;
            user.username = data.data.username;
            user.header = data.data.header;
            user.image = data.data.image;
        }
    };
}
connectWebSocket();


function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.type = 'module';
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script);
    });
}

function loadStylesheet(url) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.href = url;
        link.rel = 'stylesheet';
        link.onload = () => resolve();
        link.onerror = () => reject();
        document.head.appendChild(link);
    });
}

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('btn-games').addEventListener('click', () => {
        document.getElementById('home-content').innerHTML = loadGamesPage();
    });

    document.getElementById('btn-tournaments').addEventListener('click', () => {
        document.getElementById('home-content').innerHTML = '<h2 class="animated-text">Tournaments</h2><p>Tournament content goes here.</p>';
    });

    document.getElementById('btn-friends').addEventListener('click', () => {
        document.getElementById('home-content').innerHTML = loadFriendsPage();
        setupFriendsSearch(websocket);
    });

    document.getElementById('btn-profile').addEventListener('click', () => {
        if (user.image) {
            document.getElementById('home-content').innerHTML = loadProfilePage(user.username, user.image, user.header);
        } else if (websocket.readyState === WebSocket.OPEN) {
            document.getElementById('home-content').innerHTML = loadProfilePage(user.username, "../static/imgs/prof_demo.jpg", null);
            websocket.send(JSON.stringify({ action: 'get-prof', data: user.userid }));
        }
    });

    document.getElementById("paddle-game").addEventListener("click", async () => {
        const response = await fetch("/game_paddle");
        const data = await response.text();
        document.getElementById('game-container').innerHTML = data;
        await loadStylesheet('../static/styles/game_paddle.css');
        await loadScript('../static/logic/game_paddle.mjs');
        homeContainer.style.display = "none";
        gameContainer.style.display = "block";
    });
});

document.getElementById('home-content').innerHTML = loadGamesPage();
