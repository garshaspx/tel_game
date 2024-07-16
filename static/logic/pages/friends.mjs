

export function loadFriendsPage() {
    return `
        <h2 class="animated-text">Friends</h2>
        <div class="friends-input-container">
            <input type="text" id="friend-search" placeholder="Search for friends...">
        </div>
        <div class="friends-list-container">
            <div id="friends-box-container"></div>
        </div>
    `;
}

import {showNotif, hideNotif} from "../main.mjs"

export function setupFriendsSearch(websocket) {

    const friendSearchInput = document.getElementById('friend-search');
    let searchTimeout;

    friendSearchInput.addEventListener('input', () => {

        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            const searchQuery = friendSearchInput.value;

            if (websocket.readyState === WebSocket.OPEN && searchQuery !== "") {
                websocket.send(JSON.stringify({ action: 'searchFriends', data: searchQuery }));

            } else  if (searchQuery === ""){
                document.getElementById('friends-list-container').innerHTML = "";
            } else {
                setupFriendsSearch(websocket)
            }

        }, 1000); // TODO add a else when there where no connection to retry after connection

    });
}



export function handleFriendsSearchResults(websocket, data) {
    const friendsListContainer = document.getElementById('friends-box-container');
    friendsListContainer.innerHTML = '';

    let friendsHTML = `
        <div class="friends-list-container">
    `;
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
                
                    <a class="profile-username" target="_blank">
                        <button id="send_friend" data-user="${key}">add friends</button>
                    </a>

                </div>
            `;
        });
    }
    friendsHTML += `</div>`;
    friendsListContainer.innerHTML = friendsHTML;



    const sendFriendButtons = document.querySelectorAll('#send_friend');

    sendFriendButtons.forEach(button => {
        button.addEventListener('click', () => {
            websocket.send(JSON.stringify({ action: 'send-freind', data: button.dataset.user}));
            showNotif("friend request sent.");
            setTimeout(function() {
                hideNotif();
            }, 2000);
        });
    });
}
