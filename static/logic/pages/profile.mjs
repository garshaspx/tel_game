// WebApp/static/logic/pages/profile.mjs

export function loadProfilePage(username, prof, header) {
    return `
        <div class="profile-container">
            <div class="profile-image">
                <img src=${prof} alt="Profile Image" loading="lazy">
            </div>
            <div class="profile-header">
                <img src=${header} alt="header" loading="lazy">
            </div>
            <h2 class="profile-username">${username}</h2>
            <a href="http://t.me/garshaspx" class="profile-username" target="_blank">
                <button>hello thereeeeeee</button>
            </a>
        </div>
    `;
}