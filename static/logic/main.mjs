

const connectionnotification = document.getElementById('notification');

export function showNotif(text) {
    document.getElementById('notification').innerHTML = `
        <p>${text}</p>
    `;
    connectionnotification.style.display = 'block';
}

export function hideNotif() {
    connectionnotification.style.display = 'none';
}


class PersonalInfo {
    constructor(name, username, image, header, userid) {
        this.name = name;
        this.username = username;
        this.image = image;
        this.header = header;
        this.userid = userid;
    }
}

let user = new PersonalInfo(null,null, null, null, new URLSearchParams(window.location.search).get('userid'));

console.log(user);
let websocket;
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

        // } else if (data.action === "check-username") {
            //
            // if (data.data === "username-available") {
            //
            //     statusText.textContent = "username is available.";
            //     statusText.style.color = "green";
            //
            //     setTimeout(() => {
            //         loginContainer.style.display = "none";
            //         homeContainer.style.display = "block";
            //     }, 1000);
            //
            // } else if (data.data === "username-notavailable") {
            //     statusText.textContent = "username is not available.";
            //     statusText.style.color = "red";
            //
            // } else {
            //     user.username = data.data;
            //     // statusText.textContent = data.data;
            //     // statusText.style.color = "green";
            //     // setTimeout(() => {
            //     loginContainer.style.display = "none";
            //     homeContainer.style.display = "block";
            //     // }, 1000);
            // }

        } else if (data.action === "user-info") {

            user.name = data.data.name;
            user.username = data.data.username;
            user.header = data.data.header;
            user.image = data.data.image;

            console.log(user)

            // document.getElementById('content').innerHTML = loadProfilePage(user.username, user.image, user.header);
        }
    };
}
connectWebSocket();



import { loadProfilePage } from './pages/profile.mjs';
import {
    loadFriendsPage,
    setupFriendsSearch,
    handleFriendsSearchResults
} from './pages/friends.mjs';
import { loadGamesPage } from './pages/games.mjs';


// const usernameInput = document.getElementById('username');
// const checkUsernameButton = document.getElementById('check-username');
// const statusText = document.getElementById('username-status');

// const loginContainer = document.getElementById('login-container');
// const homeContainer = document.getElementById('home-container');


//         loginContainer.style.display = "none";
//         homeContainer.style.display = "block";

document.addEventListener('DOMContentLoaded', () => {

    // checkUsernameButton.addEventListener('click', () => {
    //
    //     const username = usernameInput.value;
    //
    //     if (username) {
    //
    //         statusText.textContent = "Checking username...";
    //         if (websocket.readyState === WebSocket.OPEN) {
    //             websocket.send(JSON.stringify({ action: 'set-username', data: username }));
    //         }
    //
    //     } else {
    //         statusText.textContent = "Please enter a username";
    //         statusText.style.color = "red";
    //     }
    //
    // });


    document.getElementById('btn-games').addEventListener('click', () => {
        document.getElementById('content').innerHTML = loadGamesPage();
    });

    document.getElementById('btn-tournaments').addEventListener('click', () => {
        document.getElementById('content').innerHTML = '<h2 class="animated-text">Tournaments</h2><p>Tournament content goes here.</p>';
    });

    // document.getElementById('btn-news').addEventListener('click', () => {
    //     document.getElementById('content').innerHTML = '<h2>News</h2><p>News content goes here.</p>';
    // });

    document.getElementById('btn-friends').addEventListener('click', () => {
        document.getElementById('content').innerHTML = loadFriendsPage();
        setupFriendsSearch(websocket);
    });

    document.getElementById('btn-profile').addEventListener('click', () => {

        if (user.image) {
            document.getElementById('content').innerHTML = loadProfilePage(user.username, user.image, user.header);
        } else if (websocket.readyState === WebSocket.OPEN) {
            document.getElementById('content').innerHTML = loadProfilePage(user.username, "../static/imgs/prof_demo.jpg", null);
            websocket.send(JSON.stringify({ action: 'get-prof', data: user.userid }));
        }
    });
});
//
//
// const textAnimation = document.createElement('style');
// document.head.appendChild(textAnimation);
// const keyframes = `
// @keyframes textColor {
//     0% {
//         color: #23d5ab;
//     }
//     25% {
//         color: #23a6d5;
//     }
//     50% {
//         color: #e73c7e;
//     }
//     75% {
//         color: #ee7752;
//     }
//     100% {
//         color: #23d5ab;
//     }
// }`;
// textAnimation.sheet.insertRule(keyframes, 0);
document.getElementById('content').innerHTML = loadGamesPage();
