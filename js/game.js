(async () => {
    const { data: { session } } = await db.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    const userId = session.user.id;

    const profileEl = document.getElementById('user-profile');
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
    profileEl.append(avatar, nameEl);

    document.getElementById('logout-btn').addEventListener('click', async () => {
        await db.auth.signOut();
        window.location.href = 'login.html';
    });

    const params = new URLSearchParams(window.location.search);
    const gameId = parseInt(params.get('id'), 10);
    const detailEl = document.getElementById('game-detail');

    if (!gameId) {
        detailEl.textContent = 'Game not found.';
        return;
    }

    let currentStars = null;

    async function loadGame() {
        const { data: game, error } = await db
            .from('games_with_ratings')
            .select('*')
            .eq('id', gameId)
            .single();

        if (error || !game) {
            detailEl.textContent = 'Game not found.';
            return;
        }

        const { data: myRating } = await db
            .from('ratings')
            .select('stars')
            .eq('user_id', userId)
            .eq('game_id', gameId)
            .maybeSingle();

        currentStars = myRating?.stars ?? null;

        renderDetail(game);
    }

    function renderDetail(game) {
        detailEl.replaceChildren();

        const cover = document.createElement('img');
        cover.className = 'game-cover';
        cover.src = game.cover_url;
        cover.alt = game.title;
        cover.style.maxWidth = '240px';
        cover.style.borderRadius = '8px';
        cover.style.marginBottom = '16px';

        const title = document.createElement('h1');
        title.className = 'page-title';
        title.style.marginBottom = '8px';
        title.textContent = game.title;

        const avgLine = document.createElement('div');
        avgLine.className = 'star-rating';
        avgLine.style.fontSize = '16px';
        avgLine.style.marginBottom = '24px';
        avgLine.textContent = formatAvg(game.avg_rating, game.rating_count);

        const yourLabel = document.createElement('h3');
        yourLabel.textContent = 'Your rating';
        yourLabel.style.marginBottom = '8px';

        const starRow = document.createElement('div');
        starRow.className = 'star-rating';
        starRow.style.fontSize = '32px';
        starRow.style.cursor = 'pointer';
        starRow.style.userSelect = 'none';

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = i <= (currentStars ?? 0) ? '★' : '☆';
            star.style.marginRight = '4px';
            star.addEventListener('click', () => handleStarClick(i));
            starRow.appendChild(star);
        }

        const errorLine = document.createElement('div');
        errorLine.id = 'rating-error';
        errorLine.className = 'error-text';

        detailEl.append(cover, title, avgLine, yourLabel, starRow, errorLine);
    }

    async function handleStarClick(n) {
        const errEl = document.getElementById('rating-error');
        errEl.textContent = '';

        if (currentStars === n) {
            const { error } = await db
                .from('ratings')
                .delete()
                .eq('user_id', userId)
                .eq('game_id', gameId);
            if (error) {
                errEl.textContent = error.message;
                return;
            }
        } else {
            const { error } = await db
                .from('ratings')
                .upsert(
                    { user_id: userId, game_id: gameId, stars: n },
                    { onConflict: 'user_id,game_id' }
                );
            if (error) {
                errEl.textContent = error.message;
                return;
            }
        }

        await loadGame();
    }

    function formatAvg(avg, count) {
        if (!count) return 'No ratings yet';
        return `★ ${avg.toFixed(1)} — ${count} rating${count === 1 ? '' : 's'}`;
    }

    await loadGame();
})();
