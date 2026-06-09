(async () => {

    const { data: { session } } = await db.auth.getSession();
    if (session) {
        window.location.href = '../index.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        const errorEl = document.getElementById('login-error');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorEl.textContent = '';

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            const { error } = await db.auth.signInWithPassword({ email, password });
            if (error) {
                errorEl.textContent = error.message;
                return;
            }
            window.location.href = '../index.html';
        });
    }

    if (signupForm) {
        const errorEl = document.getElementById('signup-error');

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorEl.textContent = '';
            errorEl.classList.remove('success-text');

            const username = document.getElementById('signup-username').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;

            if (!/^\S{3,20}$/.test(username)) {
                errorEl.textContent = 'Username must be 3–20 characters and contain no spaces.';
                return;
            }
            if (password.length < 8) {
                errorEl.textContent = 'Password must be at least 8 characters.';
                return;
            }

            const { data, error } = await db.auth.signUp({
                email,
                password,
                options: { data: { username } }
            });
            if (error) {
                errorEl.textContent = error.message;
                return;
            }

            // If email confirmation is enabled in Supabase, signUp succeeds
            // but returns no session. Redirecting to index.html would just
            // bounce the user back here with no explanation.
            if (!data.session) {
                errorEl.classList.add('success-text');
                errorEl.textContent = 'Check your email to confirm your account, then log in.';
                return;
            }

            window.location.href = '../index.html';
        });
    }
})();
