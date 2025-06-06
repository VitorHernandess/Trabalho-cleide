document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.replace('index.html');
        return;
    }

    // Update username and avatar
    updateUserDisplay();

    // Settings functionality
    const avatarInput = document.getElementById('avatarInput');
    avatarInput.addEventListener('change', handleAvatarChange);

    function handleAvatarChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                // Update preview
                document.getElementById('previewAvatar').src = imageData;
                // Update sidebar avatar
                document.getElementById('userAvatar').src = imageData;
                // Save to localStorage
                currentUser.avatar = imageData;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Update user in users array
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = users.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    users[userIndex].avatar = imageData;
                    localStorage.setItem('users', JSON.stringify(users));
                }
            };
            reader.readAsDataURL(file);
        }
    }

    function updateUserDisplay() {
        document.getElementById('usernameDisplay').textContent = `Olá, ${currentUser.name}`;
        document.getElementById('newUsername').value = currentUser.name;
        if (currentUser.avatar) {
            document.getElementById('userAvatar').src = currentUser.avatar;
            document.getElementById('previewAvatar').src = currentUser.avatar;
        }
    }

    window.updateUsername = function() {
        const newUsername = document.getElementById('newUsername').value.trim();
        
        if (!newUsername) {
            alert('Por favor, insira um nome de usuário válido.');
            return;
        }

        // Update current user
        currentUser.name = newUsername;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update in users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].name = newUsername;
            localStorage.setItem('users', JSON.stringify(users));
        }

        updateUserDisplay();
        alert('Nome de usuário atualizado com sucesso!');
    };

    window.updatePassword = function() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (currentPassword !== currentUser.password) {
            alert('Senha atual incorreta.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('As novas senhas não coincidem.');
            return;
        }

        if (newPassword.length < 6) {
            alert('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        // Update current user
        currentUser.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update in users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';

        alert('Senha atualizada com sucesso!');
    };

    // Navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            if (targetId === 'logout') {
                localStorage.removeItem('currentUser');
                window.location.replace('index.html');
                return;
            }

            sections.forEach(section => {
                section.classList.add('hidden-section');
                section.classList.remove('active-section');
            });

            document.getElementById(`${targetId}-section`).classList.remove('hidden-section');
            document.getElementById(`${targetId}-section`).classList.add('active-section');

            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
        });
    });

    // Chat functionality
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-message');

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user' : 'bot');
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function getAIResponse(message) {
        const responses = [
            "Entendo como você está se sentindo. Vamos trabalhar juntos nisso.",
            "Respire fundo. Você está fazendo um ótimo trabalho.",
            "Que tal ouvir uma música relaxante? Posso sugerir algumas.",
            "Às vezes, conversar com alguém próximo pode ajudar. Quer ver sua lista de contatos?",
            "Vamos praticar alguns exercícios de respiração juntos?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    sendButton.addEventListener('click', async () => {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        userInput.value = '';

        const response = await getAIResponse(message);
        addMessage(response);
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    // Music player functionality
    const createPlaylistBtn = document.getElementById('create-playlist');
    const aiSuggestBtn = document.getElementById('ai-suggest');

    createPlaylistBtn.addEventListener('click', () => {
        const playlistName = prompt('Nome da nova playlist:');
        if (playlistName) {
            const playlistsContainer = document.querySelector('.playlists');
            const playlistCard = document.createElement('div');
            playlistCard.classList.add('playlist-card');
            playlistCard.innerHTML = `
                <h3>${playlistName}</h3>
                <ul class="song-list">
                    <li>Adicione músicas aqui</li>
                </ul>
            `;
            playlistsContainer.appendChild(playlistCard);
        }
    });

    aiSuggestBtn.addEventListener('click', () => {
        const suggestions = [
            "Sons da Natureza - Chuva Suave",
            "Meditação Guiada - Relaxamento Profundo",
            "Piano Relaxante - Música para Acalmar",
            "Sons do Oceano - Ondas Tranquilas",
            "Música Ambiente - Paz Interior"
        ];

        const playlistsContainer = document.querySelector('.playlists');
        const playlistCard = document.createElement('div');
        playlistCard.classList.add('playlist-card');
        playlistCard.innerHTML = `
            <h3>Sugestões da IA</h3>
            <ul class="song-list">
                ${suggestions.map(song => `<li>${song}</li>`).join('')}
            </ul>
        `;
        playlistsContainer.appendChild(playlistCard);
    });

    // Contacts functionality
    const addContactBtn = document.getElementById('add-contact-btn');
    const contactsList = document.querySelector('.contacts-list');

    addContactBtn.addEventListener('click', () => {
        const name = prompt('Nome do contato:');
        const phone = prompt('Número de telefone:');
        
        if (name && phone) {
            const contactCard = document.createElement('div');
            contactCard.classList.add('contact-card');
            contactCard.innerHTML = `
                <div class="contact-info">
                    <h4>${name}</h4>
                    <p>${phone}</p>
                </div>
            `;
            contactsList.appendChild(contactCard);
        }
    });
}); 