(async () => {

    const { data: { session } } = await db.auth.getSession();
    if (!session) {
        window.location.href = 'html/login.html';
        return;
    }

    const userId = session.user.id;


    const profileEl = document.getElementById('user-profile');
    const { data: profile } = await db
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    const username = profile?.username ?? '?';
    avatar.textContent = username.charAt(0).toUpperCase();

    const nameEl = document.createElement('div');
    nameEl.className = 'username';
    nameEl.textContent = username;

    profileEl.append(avatar, nameEl);

    document.getElementById('logout-btn').addEventListener('click', async () => {
        await db.auth.signOut();
        window.location.href = 'html/login.html';
    });

    const gridEl = document.getElementById('games-grid');
    const { data: games, error } = await db
        .from('games_with_ratings')
        .select('*')
        .order('title');

    if (error) {
        gridEl.textContent = 'Could not load games: ' + error.message;
        return;
    }

    for (const game of games) {
        gridEl.appendChild(renderCard(game));
    }
})();

function renderCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.addEventListener('click', () => {
        window.location.href = `html/game.html?id=${game.id}`;
    });

    const img = document.createElement('img');
    img.className = 'game-cover';
    img.src = game.cover_url;
    img.alt = game.title;

    const info = document.createElement('div');
    info.className = 'game-info';

    const title = document.createElement('div');
    title.className = 'game-title';
    title.title = game.title;
    title.textContent = game.title;

    const stars = document.createElement('div');
    stars.className = 'star-rating';
    stars.textContent = formatRating(game.avg_rating, game.rating_count);

    info.append(title, stars);
    card.append(img, info);
    return card;
}

function formatRating(avg, count) {
    if (!count) return 'No ratings yet';
    const rounded = Math.round(avg);
    const glyphs = '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
    return `${glyphs} ${avg.toFixed(1)}`;
}
