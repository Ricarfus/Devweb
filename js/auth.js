document.addEventListener('DOMContentLoaded', () => {

    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');


    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginBox.classList.add('hidden');
            registerBox.classList.remove('hidden');
            registerError.textContent = '';
            registerForm.reset();
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
            loginError.textContent = '';
            loginForm.reset();
        });
    }


    const hashPassword = (password) => {

        return btoa(password + "gametrackk_salt");
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {

        const re = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        return re.test(password);
    };

    const getUsers = () => {
        const users = localStorage.getItem('gametrackk_users');
        return users ? JSON.parse(users) : [];
    };

    const saveUser = (user) => {
        const users = getUsers();
        users.push(user);
        localStorage.setItem('gametrackk_users', JSON.stringify(users));
    };


    const currentUser = localStorage.getItem('gametrackk_session');

 
    if (currentUser && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
        return;
    }

    if (!currentUser && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }


    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            registerError.textContent = '';

            const email = document.getElementById('reg-email').value.trim();
            const username = document.getElementById('reg-username').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (!email || !username || !password || !confirmPassword) {
                registerError.textContent = 'Please fill out all fields.';
                return;
            }

            if (!validateEmail(email)) {
                registerError.textContent = 'Please enter a valid email address.';
                return;
            }

            if (!validatePassword(password)) {
                registerError.textContent = 'Password must be at least 8 chars long, contain a number and a special character.';
                return;
            }

            if (password !== confirmPassword) {
                registerError.textContent = 'Passwords do not match.';
                return;
            }

            const users = getUsers();
            if (users.find(u => u.email === email || u.username === username)) {
                registerError.textContent = 'Username or email already exists.';
                return;
            }

            const newUser = {
                id: Date.now().toString(),
                email,
                username,
                passwordHash: hashPassword(password)
            };

            saveUser(newUser);


            localStorage.setItem('gametrackk_session', JSON.stringify({ id: newUser.id, username: newUser.username }));
            window.location.href = 'index.html';
        });
    }


    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            loginError.textContent = '';

            const emailOrUsername = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            if (!emailOrUsername || !password) {
                loginError.textContent = 'Please enter username/email and password.';
                return;
            }

            const users = getUsers();
            const user = users.find(u => u.email === emailOrUsername || u.username === emailOrUsername);

            if (!user) {
                loginError.textContent = 'Invalid credentials.';
                return;
            }

            if (user.passwordHash !== hashPassword(password)) {
                loginError.textContent = 'Invalid credentials.';
                return;
            }


            localStorage.setItem('gametrackk_session', JSON.stringify({ id: user.id, username: user.username }));
            window.location.href = 'index.html';
        });
    }
});
