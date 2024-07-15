

export function loadGamesPage() {
    let gamesHTML = `
        <h2 class="animated-text">Games</h2>
        <div class="games-container">
    `;

    for (let i = 1; i <= 20; i++) {
        gamesHTML += `
            <div class="game-box">
                <p>Game Item ${i}</p>

                <a href="http://t.me/garshaspx" class="profile-username" target="_blank">
                    <button>hello thereeeeeee</button>
                </a>


            </div>
        `;
    }

    gamesHTML += `</div>`;
    return gamesHTML;
}
