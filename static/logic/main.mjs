
const popup = document.getElementById('popup');
const popupBody = document.getElementById('popup-body');
const notification = document.getElementById('notification');
const gameWrapper = document.getElementById('game-wrapper');
const gameContent = document.getElementById('game-content');
const homeContainer = document.getElementById('home-container');
const profileHeader = document.getElementById('profile-header');
const profileImage = document.getElementById('profile-image');
const profileUsername = document.getElementById('profile-username');
const profileName = document.getElementById('profile-name');
const friendSearchInput = document.getElementById('friend-search');
const friendsListContainer = document.getElementById('friends-list-container');


const pageContainer = {
    games: document.getElementById('home-content-games'),
    tournaments: document.getElementById('home-content-tournaments'),
    friends: document.getElementById('home-content-friends'),
    profile: document.getElementById('home-content-profile')
};

class PersonalInfo {
    constructor(name, username, prof_url, header, userid, friends) {
        this.name = name;
        this.username = username;
        this.prof_url = prof_url;
        this.header = header;
        this.userid = userid;
        this.friends = friends;
}}

let searchTimeout;
let websocket;
let user = new PersonalInfo(null, null, null, null, new URLSearchParams(window.location.search).get('userid'), null);


function showNotif(text) {
    notification.innerHTML = `<p>${text}</p>`;
    notification.style.display = 'block';
}

function hideNotif() {
    notification.style.display = 'none';
}

function openPopup(content) { // Function to open the popup to play with freinds
    popupBody.innerHTML = content;
    popup.style.display = 'flex';
    homeContainer.classList.add('blur');
}

function updateProfile() {
    if (user.header) {
        profileHeader.src = user.header;
    }
    if (user.prof_url) {
        profileImage.src = user.prof_url;
    }
    profileUsername.textContent = user.username;
    profileName.textContent = user.name;
}


function updateFriends() {
    friendsListContainer.innerHTML = '';
    let friendsHTML = `<div class="friends-list-container" id="friends-list-container">`;

    if (Object.keys(user.friends).length === 0) {
        friendsHTML +=
                `<div class="friends-box-container">
                    <p>you have no friends :(</p>
                </div>`;
    } else {
        Object.keys(user.friends).forEach(key => {
            const friend = user.friends[key];
            friendsHTML += `
                <div class="friends-box-container">                
                    <p>${friend.name} -- ${friend.username}</p>
                    <div class="profile-image">
                        <img src=${friend.prof_url} alt="Profile Image" loading="lazy">
                    </div>
                    <button class="play-game" data-user="${key}">play</button>
                </div>`;
        });
    }
    friendsListContainer.innerHTML = friendsHTML + `</div>`;

    const playGameButtons = document.querySelectorAll('.play-game');
    playGameButtons.forEach(button => {
        button.addEventListener('click', () => {
            openPopup(pageContainer.games.innerHTML); // TODO add function to buttons to play with friend
        });
    });
}


function handleFriendsSearchResults(data) {
    friendsListContainer.innerHTML = '';
    let friendsHTML = `<div class="friends-list-container" id="friends-list-container">`;

    if (Object.keys(data).length === 0) {
        friendsHTML +=
                `<div class="friends-box-container">
                    <p>No friends found.</p>
                </div>`;
    } else {
        Object.keys(data).forEach(key => {
            const user = data[key];
            friendsHTML += `
                <div class="friends-box-container">                
                    <p>${user.name} -- ${user.username}</p>
                    <div class="profile-image">
                        <img src=${user.prof_url} alt="Profile Image" loading="lazy">
                    </div>
                    <button class="send-friend" data-user="${key}">Add Friend</button>
                </div>`;
        });
    }
    friendsHTML += `</div>`;
    friendsListContainer.innerHTML = friendsHTML;

    const sendFriendButtons = document.querySelectorAll('.send-friend');
    sendFriendButtons.forEach(button => {
        button.addEventListener('click', () => {
            websocket.send(JSON.stringify({ action: 'send-friend-request', data: button.dataset.user}));
            showNotif("sending friend request ...");
            setTimeout(function() {
                hideNotif();
            }, 2000); // TODO change this to remove the notif when server responded
        });
    });
}


function connectWebSocket() {
    // websocket = new WebSocket(`ws://window.location.host/ws/${user.userid}`);
    websocket = new WebSocket(`ws://49.12.97.130/ws/${user.userid}`);


    websocket.onopen = function () {
        hideNotif();
    };

    websocket.onerror = function () {
        showNotif('Connection lost due to error. Reconnecting...');
    };

    websocket.onclose = function () {
        showNotif('Connection lost. Reconnecting...');
        setTimeout(connectWebSocket, 1000);
    };

    websocket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.action === "friends-search") {
            handleFriendsSearchResults(data.data);
        } else if (data.action === "show-notif") {
            alert(data.data); // # TODO there is 2 type on notif. choose
        } else if (data.action === "user-info") {
            user.name = data.data.user.name;
            user.username = data.data.user.username;
            user.header = data.data.user.header;
            user.prof_url = data.data.user.prof_url;
            user.friends = data.data.friends;
            updateProfile();
            updateFriends();
        }
    };
}

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

function changeHomePage(pageId) {
    Object.values(pageContainer).forEach(page => page.style.display = 'none');
    pageContainer[pageId].style.display = 'block';
    document.querySelectorAll('.navbar button').forEach(button => button.classList.remove('active'));
    const activeButton = document.getElementById(`btn-${pageId}`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('closePopup').addEventListener('click', function () {
        popup.style.display = 'none';
        homeContainer.classList.remove('blur');
    });

    document.getElementById('btn-games').addEventListener('click', () => {
        changeHomePage('games');
    });

    document.getElementById('btn-tournaments').addEventListener('click', () => {
        changeHomePage('tournaments');
    });

    document.getElementById('btn-friends').addEventListener('click', () => {
        changeHomePage('friends');
    });

    document.getElementById('btn-profile').addEventListener('click', () => {
        changeHomePage('profile');
    });

    document.getElementById('back-gamepage').addEventListener('click', () => {
        homeContainer.style.display = "block";
        gameWrapper.style.display = "none";
    });

    document.getElementById("game_paddle").addEventListener("click", async () => {
        const response = await fetch("/game_paddle");
        gameContent.innerHTML = await response.text();
        await loadScript('../static/logic/game_paddle.mjs');
        await loadStylesheet('../static/styles/game_paddle.css');
        gameWrapper.style.display = "block";
        homeContainer.style.display = "none";
    });

    document.getElementById("game_snake").addEventListener('click', async () => {
        const response = await fetch('/game_snake');
        gameContent.innerHTML = await response.text();
        await loadStylesheet('../static/styles/game_snake.css');
        await loadScript('../static/logic/game_snake.mjs');
        homeContainer.style.display = 'none';
        gameWrapper.style.display = 'block';
        console.log("here");
    });

    friendSearchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (websocket.readyState === WebSocket.OPEN && friendSearchInput.value !== "") {
                websocket.send(JSON.stringify({ action: 'searchFriends', data: friendSearchInput.value }));
            } else if (friendSearchInput.value === ""){
                friendsListContainer.innerHTML = "";
            }
        }, 500); // TODO add a else when there where no connection to retry after connection
    });

});

changeHomePage('games');
connectWebSocket();
