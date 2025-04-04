document.addEventListener('DOMContentLoaded', function() {
    // Elementos das telas
    const loginScreen = document.getElementById('login-screen');
    const recoveryScreen = document.getElementById('recovery-screen');
    const menuScreen = document.getElementById('menu-screen');
    
    // Elementos da tela de login
    const loginButton = document.getElementById('login-button');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('user-password');
    const userLoginInput = document.getElementById('user-login');
    
    // Elementos da tela de recuperação
    const recoveryButton = document.getElementById('recovery-button');
    const backToLoginLink = document.getElementById('back-to-login');
    
    // Elementos do menu principal
    const logoutButton = document.getElementById('logout-button');
    const displayName = document.getElementById('display-name');

    // Função para mostrar uma tela
    function showScreen(screen) {
        // Esconde todas as telas
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.add('hidden');
        });
        
        // Mostra a tela solicitada
        screen.classList.remove('hidden');
    }

    // Evento do botão Continuar/Login
    loginButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const login = userLoginInput.value;
        const password = passwordInput.value;
        
        if (!login || !password) {
            alert('Por favor, preencha todos os campos!');
            return;
        }
        
        // Define o nome do usuário como o login
        displayName.textContent = login;
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
        const email = document.getElementById('recovery-email').value;
        
        if (!email) {
            alert('Por favor, informe seu e-mail cadastrado');
            return;
        }
        
        alert(`Instruções de recuperação enviadas para: ${email}`);
        showScreen(loginScreen);
    });

    // Evento do link Voltar para login
    backToLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        showScreen(loginScreen);
    });

    // Evento do botão Sair
    logoutButton.addEventListener('click', function() {
        showScreen(loginScreen);
        // Limpa os campos ao sair
        userLoginInput.value = '';
        passwordInput.value = '';
    });

    // Mostrar/esconder senha
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
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
    
    // Inicializar mostrando a tela de login
    showScreen(loginScreen);
    
    // Atualizar estatísticas a cada 5 segundos (simulação)
    updateStats();
    setInterval(updateStats, 5000);
});