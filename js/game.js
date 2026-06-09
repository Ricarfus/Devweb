(async () => {
    const userId = await initSidebar('login.html');
    if (!userId) return;

    const params = new URLSearchParams(window.location.search);
    const gameId = Number.parseInt(params.get('id'), 10);
    const detailEl = document.getElementById('game-detail');

    if (Number.isNaN(gameId)) {
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
        cover.className = 'game-cover detail-cover';
        cover.src = game.cover_url;
        cover.alt = game.title;

        const title = document.createElement('h1');
        title.className = 'page-title detail-title';
        title.textContent = game.title;

        const avgLine = document.createElement('div');
        avgLine.className = 'star-rating detail-avg';
        avgLine.textContent = formatAvg(game.avg_rating, game.rating_count);

        const yourLabel = document.createElement('h3');
        yourLabel.className = 'detail-rating-label';
        yourLabel.textContent = 'Your rating';

        const starRow = document.createElement('div');
        starRow.className = 'star-rating detail-star-row';

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = i <= (currentStars ?? 0) ? '★' : '☆';
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
            // Clicking your current rating removes it
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
        if (!Number(count)) return 'No ratings yet';
        const value = Number(avg); // numeric columns can arrive as strings
        return `★ ${value.toFixed(1)} — ${count} rating${Number(count) === 1 ? '' : 's'}`;
    }

    await loadGame();
})();
