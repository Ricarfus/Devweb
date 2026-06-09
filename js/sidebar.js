// Shared sidebar logic: auth guard, profile display, logout.
// Used by home.js and game.js. Pass the path to login.html
// relative to the page that's calling it.
async function initSidebar(loginUrl) {
    const { data: { session } } = await db.auth.getSession();
    if (!session) {
        window.location.href = loginUrl;
        return null;
    }

    const userId = session.user.id;

    const { data: profile } = await db
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

    const username = profile?.username ?? '?';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = username.charAt(0).toUpperCase();

    const nameEl = document.createElement('div');
    nameEl.className = 'username';
    nameEl.textContent = username;

    document.getElementById('user-profile').append(avatar, nameEl);

    document.getElementById('logout-btn').addEventListener('click', async () => {
        await db.auth.signOut();
        window.location.href = loginUrl;
    });

    return userId;
}
