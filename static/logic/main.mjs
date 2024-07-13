

const connectionnotification = document.getElementById('notification');

function show_ConnectionNotification(text) {
    document.getElementById('notification').innerHTML = `
        <p>${text}</p>
    `;
    connectionnotification.style.display = 'block';
}

function hide_ConnectionNotification() {
    connectionnotification.style.display = 'none';
}


const userId = new URLSearchParams(window.location.search).get('userid');
let websocket;

function connectWebSocket() {
    websocket = new WebSocket(`ws://localhost:80/ws/${userId}`);
    // websocket = new WebSocket(`ws://49.12.97.130:80/ws/${userId}`);

    websocket.onopen = function () {
        hide_ConnectionNotification();
    };

    websocket.onerror = function () {
        show_ConnectionNotification('Connection lost duo to error. Reconnecting...');
    };

    websocket.onclose = function () {
        show_ConnectionNotification('Connection lost. Reconnecting...');
        setTimeout(connectWebSocket, 1000);
    };

    websocket.onmessage = function (event) {

        const data = JSON.parse(event.data);

        if (data.action === "friends-search") {
            handleSearchResults(data.data);


        } else if (data.action === "check-username") {
            if (data.data === "username-active") {

                // statusText.textContent = data.data;
                // statusText.style.color = "green";
                // setTimeout(() => {
                loginContainer.style.display = "none";
                homeContainer.style.display = "block";
                // }, 500);

            } else if (data.data === "username-available") {

                statusText.textContent = "username is available.";
                statusText.style.color = "green";

                setTimeout(() => {
                    loginContainer.style.display = "none";
                    homeContainer.style.display = "block";
                }, 1000);

            } else if (data.data === "username-notavailable") {
                statusText.textContent = "username is not available.";
                statusText.style.color = "red";

            }


        }



    };
}
connectWebSocket();



import { loadProfilePage } from './pages/profile.mjs';
import { loadFriendsPage, setupFriendsSearch, handleSearchResults} from './pages/friends.mjs';
import { loadGamesPage } from './pages/games.mjs';


const usernameInput = document.getElementById('username');
const checkUsernameButton = document.getElementById('check-username');
const statusText = document.getElementById('username-status');

const loginContainer = document.getElementById('login-container');
const homeContainer = document.getElementById('home-container');




document.addEventListener('DOMContentLoaded', () => {

    checkUsernameButton.addEventListener('click', () => {

        const username = usernameInput.value;

        if (username) {

            statusText.textContent = "Checking username...";
            
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.send(JSON.stringify({ action: 'set-username', data: username}));
            }


        } else {
            statusText.textContent = "Please enter a username";
            statusText.style.color = "red";
        }

    });


    document.getElementById('btn-games').addEventListener('click', () => {
        document.getElementById('content').innerHTML = loadGamesPage();
    });

    document.getElementById('btn-tournaments').addEventListener('click', () => {
        document.getElementById('content').innerHTML = '<h2>Tournaments</h2><p>Tournament content goes here.</p>';
    });

    // document.getElementById('btn-news').addEventListener('click', () => {
    //     document.getElementById('content').innerHTML = '<h2>News</h2><p>News content goes here.</p>';
    // });

    document.getElementById('btn-friends').addEventListener('click', () => {
        document.getElementById('content').innerHTML = loadFriendsPage();
        setupFriendsSearch(websocket);
    });

    document.getElementById('btn-profile').addEventListener('click', () => {
        document.getElementById('content').innerHTML = loadProfilePage(userId);
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


loginContainer.style.display = "none";
homeContainer.style.display = "block";