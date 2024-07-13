

export function loadFriendsPage() {
    return `
        <h2 class="animated-text">Friends</h2>
        <div class="input-container">
            <input type="text" id="friend-search" placeholder="Search for friends...">
        </div>
        <div id="friends-list"></div>
    `;
}




export function handleSearchResults(data) {
    const friendsListContainer = document.getElementById('friends-list');
    friendsListContainer.innerHTML = '';

    let friendsHTML = `
        <div class="game-container">
    `;

    if (data.length === 0) {
        friendsHTML += '<p>No friends found.</p>';
    } else {
        Object.keys(data).forEach(key => {
            const user = data[key];
            friendsHTML += `
                <div class="game-box">
                    <p>${user}</p>
                </div>
            `;
        });
    }

    friendsHTML += `</div>`;
    friendsListContainer.innerHTML = friendsHTML;
}


export function setupFriendsSearch(websocket) {

    const friendSearchInput = document.getElementById('friend-search');
    let searchTimeout;

    friendSearchInput.addEventListener('input', () => {
        
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const searchQuery = friendSearchInput.value;
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.send(JSON.stringify({ action: 'searchFriends', query: searchQuery }));
            }
        }, 800); // TODO add a else when there where no connection to retry after connection

    });
}