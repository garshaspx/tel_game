

export function loadGamesPage() {
    let gamesHTML = `
        <h2 class="animated-text">Games</h2>
        <div class="game-list-container">
    `;

    gamesHTML += `
        <div class="game-box-container">
            <p>paddle game</p>

            <a  class="profile-username" target="_blank">
                <button id="paddle-game">play paddle game</button>
            </a>
        </div>
    `;

    gamesHTML += `
        <div class="game-box-container">
            <p>Game Item i</p>

            <a href="http://t.me/garshaspx" class="profile-username" target="_blank">
                <button>hello thereeeeeee</button>
            </a>
        </div>
    `;
    gamesHTML += `
        <div class="game-box-container">
            <p>Game Item i</p>

            <a href="http://t.me/garshaspx" class="profile-username" target="_blank">
                <button>hello thereeeeeee</button>
            </a>
        </div>
    `;

    gamesHTML += `</div>`;
    return gamesHTML;
}