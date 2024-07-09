const usernameInput = document.getElementById('username');
const checkButton = document.getElementById('check-username');
const statusText = document.getElementById('username-status');
const loginContainer = document.getElementById('login-container');
const homeContainer = document.getElementById('home-container');


const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('number');


let websocket;

statusText.textContent = "Loading ...";

function connectWebSocket() {
    const websocket = new WebSocket(`ws://49.12.97.130:443/ws/${userId}`);


    websocket.onopen = function (event) {
        websocket.send("isactive?");
        statusText.textContent = `----${userId}`;

    };

    websocket.onerror = function (error) {
        statusText.textContent = "No connection";
    };

    websocket.onclose = function (event) {
        statusText.textContent = "Connection lost. Reconnecting...";
        setTimeout(connectWebSocket, 1000); // Attempt to reconnect every 1 second
    };

    websocket.onmessage = function (event) {
        statusText.textContent = event.data;
        if (event.data === "active" || event.data === "Username available") {
            statusText.style.color = "green";
            setTimeout(() => {
                loginContainer.style.display = "none";
                homeContainer.style.display = "block";
            }, 1000);
        } else {
            statusText.style.color = "red";
        }
    };
}

connectWebSocket();

import { loadProfile } from './pages/profile.mjs';

document.addEventListener('DOMContentLoaded', () => {
    checkButton.addEventListener('click', () => {
        const username = usernameInput.value;
        if (username) {
            statusText.textContent = "Checking username...";
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.send(username);
            } else {
                statusText.textContent = "No connection";
            }
        } else {
            statusText.textContent = "Please enter a username";
            statusText.style.color = "red";
        }
    });

    document.getElementById('btn-games').addEventListener('click', () => {
        document.getElementById('content').innerHTML = '<h2>Games</h2><p>Game content goes here.</p>';
    });

    document.getElementById('btn-tournaments').addEventListener('click', () => {
        document.getElementById('content').innerHTML = '<h2>Tournaments</h2><p>Tournament content goes here.</p>';
    });

    document.getElementById('btn-news').addEventListener('click', () => {
        document.getElementById('content').innerHTML = '<h2>News</h2><p>News content goes here.</p>';
    });

    document.getElementById('btn-friends').addEventListener('click', () => {
        document.getElementById('content').innerHTML = '<h2>Friends</h2><p>Friends content goes here.</p>';
    });

    document.getElementById('btn-profile').addEventListener('click', () => {
        document.getElementById('content').innerHTML = loadProfile(userId);
    });
});

const textAnimation = document.createElement('style');
document.head.appendChild(textAnimation);

const keyframes = `
@keyframes textColor {
    0% {
        color: #23d5ab;
    }
    25% {
        color: #23a6d5;
    }
    50% {
        color: #e73c7e;
    }
    75% {
        color: #ee7752;
    }
    100% {
        color: #23d5ab;
    }
}`;

textAnimation.sheet.insertRule(keyframes, 0);
statusText.textContent = `----${userId}`;
