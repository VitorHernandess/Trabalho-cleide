// Database simulation using localStorage
const db = {
    users: JSON.parse(localStorage.getItem('users')) || [],
    
    addUser(name, email, password) {
        const user = {
            id: Date.now(),
            name,
            email,
            password
        };
        this.users.push(user);
        localStorage.setItem('users', JSON.stringify(this.users));
        return user;
    },
    
    findUser(email, password) {
        return this.users.find(user => user.email === email && user.password === password);
    }
};

// Form switching
function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    }
}

// Handle Login
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const user = db.findUser(email, password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Login successful, redirecting...');
        window.location.replace('dashboard.html');
    } else {
        alert('Email ou senha incorretos.');
    }
}

// Handle Register
function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!name || !email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (db.users.some(user => user.email === email)) {
        alert('Este email já está cadastrado.');
        return;
    }

    const user = db.addUser(name, email, password);
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('Registration successful, redirecting...');
    window.location.replace('dashboard.html');
}

