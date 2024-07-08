// WebApp/static/logic/pages/profile.mjs

export function loadProfile(userid) {
    return `
        <div class="profile-container">
            <div class="profile-image">
                <img src='../static/imgs/${userid}.png' alt="Profile Image">
            </div>
            <div class="profile-header">
                <img src='../static/imgs/1234.png' alt="header">
            </div>
            <h2 class="profile-username">${userid}</h2>
        </div>
    `;
}