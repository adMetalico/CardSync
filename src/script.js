let db;

// Funções utilitárias
function showError(inputElement, errorElement) {
    inputElement.parentElement.parentElement.classList.add('error');
    errorElement.style.display = 'block';
}

function hideError(inputElement, errorElement) {
    inputElement.parentElement.parentElement.classList.remove('error');
    errorElement.style.display = 'none';
}

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.add('hidden');
    });
    screen.classList.remove('hidden');
}

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('CardSynicDB', 1);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains('users')) {
                const store = db.createObjectStore('users', { keyPath: 'email' });
                store.createIndex('name', 'name', { unique: false });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = (event) => {
            reject('Erro ao abrir o banco de dados');
        };
    });
}

function deleteUser(email) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Banco de dados não inicializado');
            return;
        }

        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        const request = store.delete(email);

        request.onsuccess = () => {
            resolve('Usuário deletado com sucesso');
        };

        request.onerror = (event) => {
            reject('Erro ao deletar usuário: ' + event.target.error);
        };
    });
}

function listAllUsers() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = (event) => {
            reject('Erro ao listar usuários: ' + event.target.error);
        };
    });
}

function setupDeleteButtons() {
    document.querySelectorAll('.delete-user').forEach(btn => {
        btn.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            if (confirm(`Tem certeza que deseja deletar o usuário ${email}?`)) {
                deleteUser(email)
                    .then(() => {
                        showAdminScreen();
                    })
                    .catch(error => {
                        alert(error);
                    });
            }
        });
    });
}

function showAdminScreen() {
    listAllUsers().then(users => {
        const usersList = document.getElementById('users-list');
        usersList.innerHTML = '';
        
        if (users.length === 0) {
            usersList.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
            return;
        }
        
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-item';
            userDiv.innerHTML = `
                <div class="user-info">
                    <strong>${user.name}</strong>
                    <span>${user.email}</span>
                </div>
                <button class="btn btn-danger delete-user" data-email="${user.email}">
                    <i class="fas fa-trash"></i> Deletar
                </button>
            `;
            usersList.appendChild(userDiv);
        });
        
        setupDeleteButtons();
        showScreen(document.getElementById('admin-screen'));
    }).catch(error => {
        alert('Erro ao carregar usuários: ' + error);
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Elementos das telas
    const loginScreen = document.getElementById('login-screen');
    const recoveryScreen = document.getElementById('recovery-screen');
    const registerScreen = document.getElementById('register-screen');
    const menuScreen = document.getElementById('menu-screen');
    const adminScreen = document.getElementById('admin-screen');
    
    // Elementos da tela de login
    const loginButton = document.getElementById('login-button');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('user-password');
    const userLoginInput = document.getElementById('user-login');
    
    // Elementos da tela de registro
    const createAccountLink = document.getElementById('create-account');
    const haveAccountLink = document.getElementById('have-account');
    const registerButton = document.getElementById('register-button');
    const registerNameInput = document.getElementById('register-name');
    const registerEmailInput = document.getElementById('register-email');
    const registerPasswordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    // Elementos da tela de recuperação
    const recoveryButton = document.getElementById('recovery-button');
    const backToLoginLink = document.getElementById('back-to-login');
    
    // Elementos do menu principal
    const logoutButton = document.getElementById('logout-button');
    const displayName = document.getElementById('display-name');
    const supportButton = document.getElementById('support-button');
    const adminButton = document.getElementById('admin-button');
    const backToMenuBtn = document.getElementById('back-to-menu');
    
    // Elementos da recuperação
    const recoveryEmailInput = document.getElementById('recovery-email');
    const emailError = document.getElementById('email-error');
    
    // Inicializar banco de dados
    initDB().then(() => {
        console.log('Banco de dados inicializado');
    }).catch(error => {
        console.error('Erro ao inicializar banco de dados:', error);
    });
    
    // Evento do botão Continuar/Login
    loginButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const login = userLoginInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;
        
        // Resetar erros
        document.querySelectorAll('.input-group').forEach(group => {
            group.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.style.display = 'none';
        });
        
        // Validações
        if (login === '') {
            showError(userLoginInput, document.getElementById('login-error'));
            isValid = false;
        }
        
        if (password === '') {
            showError(passwordInput, document.getElementById('password-error'));
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Verificar usuário no banco de dados
        const transaction = db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        const request = store.get(login);
        
        request.onsuccess = (event) => {
            const user = event.target.result;
            if (user && user.password === password) {
                displayName.textContent = user.name;
                showScreen(menuScreen);
            } else {
                showError(passwordInput, document.getElementById('password-error'));
                document.getElementById('password-error').textContent = 'Usuário ou senha inválidos';
            }
        };
        
        request.onerror = () => {
            alert('Erro ao acessar o banco de dados');
        };
    });
    
    // Evento do botão de registro
    registerButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const name = registerNameInput.value.trim();
        const email = registerEmailInput.value.trim();
        const password = registerPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        let isValid = true;
        
        // Resetar erros
        document.querySelectorAll('#register-screen .input-group').forEach(group => {
            group.classList.remove('error');
        });
        document.querySelectorAll('#register-screen .error-message').forEach(msg => {
            msg.style.display = 'none';
        });
        
        // Validações
        if (name === '') {
            showError(registerNameInput, document.getElementById('name-error'));
            isValid = false;
        }
        
        if (email === '') {
            showError(registerEmailInput, document.getElementById('register-email-error'));
            document.getElementById('register-email-error').textContent = 'Por favor, informe seu e-mail';
            isValid = false;
        } else if (!registerEmailInput.checkValidity()) {
            showError(registerEmailInput, document.getElementById('register-email-error'));
            document.getElementById('register-email-error').textContent = 'Por favor, informe um e-mail válido';
            isValid = false;
        }
        
        if (password === '') {
            showError(registerPasswordInput, document.getElementById('register-password-error'));
            isValid = false;
        }
        
        if (confirmPassword === '') {
            showError(confirmPasswordInput, document.getElementById('confirm-password-error'));
            document.getElementById('confirm-password-error').textContent = 'Por favor, confirme sua senha';
            isValid = false;
        } else if (password !== confirmPassword) {
            showError(confirmPasswordInput, document.getElementById('confirm-password-error'));
            document.getElementById('confirm-password-error').textContent = 'As senhas não coincidem';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Salvar usuário no banco de dados
        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        
        const user = {
            name: name,
            email: email,
            password: password
        };
        
        const request = store.add(user);
        
        request.onsuccess = () => {
            alert('Conta criada com sucesso! Faça login para continuar.');
            showScreen(loginScreen);
            userLoginInput.value = email;
            registerNameInput.value = '';
            registerEmailInput.value = '';
            registerPasswordInput.value = '';
            confirmPasswordInput.value = '';
        };
        
        request.onerror = (event) => {
            if (event.target.error.name === 'ConstraintError') {
                showError(registerEmailInput, document.getElementById('register-email-error'));
                document.getElementById('register-email-error').textContent = 'Este e-mail já está cadastrado';
                document.getElementById('register-email-error').style.display = 'block';
            } else {
                alert('Erro ao cadastrar usuário: ' + event.target.error);
            }
        };
    });
    
    // Evento do botão de admin
    adminButton.addEventListener('click', function(e) {
        e.preventDefault();
        showAdminScreen();
    });
    
    // Evento para voltar ao menu
    backToMenuBtn.addEventListener('click', function() {
        showScreen(menuScreen);
    });
    
    // Evento do link Esqueci minha senha
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showScreen(recoveryScreen);
    });
    
    // Evento do botão de recuperação
    recoveryButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = recoveryEmailInput.value.trim();
        let isValid = true;
        
        // Resetar erros
        hideError(recoveryEmailInput, emailError);
        
        // Validar e-mail
        if (email === '') {
            showError(recoveryEmailInput, emailError);
            emailError.textContent = 'Por favor, informe seu e-mail';
            isValid = false;
        } else if (!recoveryEmailInput.checkValidity()) {
            showError(recoveryEmailInput, emailError);
            emailError.textContent = 'Por favor, informe um e-mail válido';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Simular envio de e-mail
        alert(`Instruções de recuperação enviadas para: ${email}`);
        showScreen(loginScreen);
        recoveryEmailInput.value = '';
    });
    
    // Evento do link Voltar para login
    backToLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        showScreen(loginScreen);
    });
    
    // Evento do botão de suporte
    supportButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://wa.me/5545998626323', '_blank');
    });
    
    // Evento do botão Sair
    logoutButton.addEventListener('click', function() {
        showScreen(loginScreen);
        userLoginInput.value = '';
        passwordInput.value = '';
    });
    
    // Evento criar conta
    createAccountLink.addEventListener('click', function(e) {
        e.preventDefault();
        showScreen(registerScreen);
    });
    
    // Evento já tenho conta
    haveAccountLink.addEventListener('click', function(e) {
        e.preventDefault();
        showScreen(loginScreen);
    });
    
    // Mostrar/esconder senha
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
        this.classList.toggle('fa-eye');
    });
    
    // Mostrar/esconder senha na tela de registro
    document.querySelectorAll('#register-screen .toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
            this.classList.toggle('fa-eye');
        });
    });
    
    // Efeitos de hover nos cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.03)';
        });
    });
    
    // Simular dados para o dashboard
    function updateStats() {
        const transactions = Math.floor(Math.random() * 50) + 100;
        const reconciliations = Math.floor(Math.random() * 30) + 20;
        const documents = Math.floor(Math.random() * 20) + 10;
        
        document.querySelectorAll('.stat-card p')[0].textContent = transactions;
        document.querySelectorAll('.stat-card p')[1].textContent = reconciliations;
        document.querySelectorAll('.stat-card p')[2].textContent = documents;
    }
    
    // Validação em tempo real para login
    userLoginInput.addEventListener('input', function() {
        const errorElement = document.getElementById('login-error');
        if (this.value.trim() !== '') {
            hideError(this, errorElement);
        }
    });
    
    // Validação em tempo real para senha
    passwordInput.addEventListener('input', function() {
        const errorElement = document.getElementById('password-error');
        if (this.value.trim() !== '') {
            hideError(this, errorElement);
        }
    });
    
    // Validação de e-mail em tempo real
    recoveryEmailInput.addEventListener('input', function() {
        if (this.value.trim() !== '' && this.checkValidity()) {
            hideError(this, emailError);
        }
    });
    
    // Inicializar mostrando a tela de login
    showScreen(loginScreen);
    updateStats();
});