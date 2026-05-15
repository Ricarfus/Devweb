document.addEventListener('DOMContentLoaded', () => {

    const sessionData = localStorage.getItem('gametrackk_session');
    if (!sessionData) {
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(sessionData);

    const userProfile = document.getElementById('user-profile');
    if (userProfile) {
        const initial = user.username.charAt(0).toUpperCase();
        userProfile.innerHTML = `
            <div class="avatar">${initial}</div>
            <div class="user-details">
                <div class="username">${user.username}</div>
            </div>
        `;
    }


    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('gametrackk_session');
            window.location.href = 'login.html';
        });
    }


    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();


            navItems.forEach(nav => nav.classList.remove('active'));


            tabPanes.forEach(pane => pane.classList.add('hidden'));

            item.classList.add('active');
            const tabId = item.getAttribute('data-tab');
            const targetPane = document.getElementById(`tab-${tabId}`);
            if (targetPane) {
                targetPane.classList.remove('hidden');
            }
        });
    });


    const games = [
        { title: "Apex Legends", cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/library_600x900_2x.jpg", rating: 5 },
        { title: "Star Wars Jedi: Fallen Order", cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172380/library_600x900_2x.jpg", rating: 5 },
        { title: "Animal Crossing: New Horizons", cover: "https://images.nintendolife.com/games/nintendo-switch/animal_crossing_new_horizons/cover_large.jpg", rating: 5 },
        { title: "Half-Life 3", cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/220/library_600x900_2x.jpg", rating: 5 },
        { title: "Portal 3", cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/620/library_600x900_2x.jpg", rating: 5 },
        { title: "Left 4 Dead 2", cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/550/library_600x900_2x.jpg", rating: 4 },
        { title: "Farming Simulator 2026", cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1248130/library_600x900_2x.jpg", rating: 3 },
        { title: "Grand Theft Auto VI", cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg", rating: 5 },
        { title: "Your Only Move Is HUSTLE", cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2212330/library_600x900_2x.jpg", rating: 4 },
        { title: "Marathon", cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3065800/library_600x900_2x.jpg", rating: 4 },
        { title: "RAID: Shadow Legends", cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2333480/library_600x900_2x.jpg", rating: 2 },
        { title: "Cyberpunk 2077", cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900_2x.jpg", rating: 4 },
        { title: "Death Stranding 2", cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1190460/library_600x900_2x.jpg", rating: 5 },
        { title: "The Last of Us Part II", cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/library_600x900_2x.jpg", rating: 5 },
        { title: "DOOM Eternal", cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/782330/library_600x900_2x.jpg", rating: 5 }
    ];

    const generateStarsHtml = (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? '★' : '☆';
        }
        return `<div class="star-rating">${stars}</div>`;
    };

    const createGameCard = (game, showRating = false) => {
        return `
            <div class="game-card">
                <img src="${game.cover}" alt="${game.title}" class="game-cover" onerror="this.src='https://via.placeholder.com/140x190/1e1f22/f2f3f5?text=Missing+Cover'">
                <div class="game-info">
                    <div class="game-title" title="${game.title}">${game.title}</div>
                    ${showRating ? generateStarsHtml(game.rating) : ''}
                </div>
            </div>
        `;
    };


    const populateRow = (elementId, count) => {
        const el = document.getElementById(elementId);
        if (!el) return;
        let html = '';


        const shuffledGames = [...games].sort(() => 0.5 - Math.random());

        for (let i = 0; i < count; i++) {
            html += createGameCard(shuffledGames[i % shuffledGames.length], false);
        }
        el.innerHTML = html;
    };

    populateRow('popular-games', 8);
    populateRow('suggested-games', 6);
    populateRow('online-games', 7);

    const populateGrid = () => {
        const el = document.getElementById('my-games-grid');
        if (!el) return;
        let html = '';

        for (let i = 0; i < Math.min(12, games.length); i++) {
            html += createGameCard(games[i], true);
        }
        el.innerHTML = html;
    };
    populateGrid();


    const populateSocial = () => {
        const el = document.getElementById('friends-list');
        if (!el) return;

        const friends = [
            { name: "xX_Sniperwolf_Xx", status: "online", statusText: "Online", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" },
            { name: "Nomegla", status: "ingame", statusText: "Playing The Last of Us II", avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=100&auto=format&fit=crop" },
            { name: "Sunny Cloud's Aura", status: "offline", statusText: "Offline", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" },
            { name: "Chili", status: "ingame", statusText: "Playing Destiny 2", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" },
            { name: "TheLegend27", status: "online", statusText: "Online", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100&auto=format&fit=crop" },
            { name: "BigBroYahu", status: "offline", statusText: "Last online 2 years ago", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop" }
        ];

        let html = '';
        friends.forEach(f => {
            html += `
                <div class="friend-item">
                    <div class="friend-avatar">
                        <img src="${f.avatar}" alt="${f.name}">
                        <div class="status-indicator status-${f.status}"></div>
                    </div>
                    <div class="friend-info">
                        <div class="friend-name">${f.name}</div>
                        <div class="friend-status-text ${f.status === 'ingame' ? 'ingame' : ''}">${f.statusText}</div>
                    </div>
                </div>
            `;
        });
        el.innerHTML = html;
    };
    populateSocial();

});
