// WebApp/static/logic/pages/profile.mjs

export function loadProfilePage(userid) {
    return `
        <div class="profile-container">
            <div class="profile-image">
                <img src='static/imgs/MTdmNjg5M2QtZDg5NS00ZDk5LWI5OWYtNmY2YWY3ZTgzOGQ0.png' alt="Profile Image">
            </div>
            <div class="profile-header">
                <img src='static/imgs/1234.png' alt="header">
            </div>
            <h2 class="profile-username">${userid}</h2>
            <a href="http://t.me/garshaspx" class="profile-username" target="_blank">
                <button>hello thereeeeeee</button>
            </a>
        </div>
    `;
}