export function loadGamesPage() {
    let gamesHTML = `
        <h2>Games</h2>
        <div class="games-container">
    `;

    for (let i = 1; i <= 20; i++) {
        gamesHTML += `
            <div class="game-box">
                <p>Game Item ${i}</p>
            </div>
        `;
    }

    gamesHTML += `</div>`;
    return gamesHTML;
}
