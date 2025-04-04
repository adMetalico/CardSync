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
    const sideBar = document.getElementById('sidebar-foooter');
    const logoutButton = document.getElementById('logout-button');
    const displayName = document.getElementById('display-name');
    const supportButton = document.getElementById('support-button');

    // Elementos da recuperação
    const recoveryEmailInput = document.getElementById('recovery-email');
    const emailError = document.getElementById('email-error');

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
    
    const login = userLoginInput.value.trim();
    const password = passwordInput.value.trim();
    let isValid = true;
    
    // Resetar todos os erros primeiro
    document.querySelectorAll('.input-group').forEach(group => {
        group.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.style.display = 'none';
    });
    
    // Validar login
    if (login === '') {
        showError(userLoginInput, document.getElementById('login-error'));
        isValid = false;
    }
    
    // Validar senha
    if (password === '') {
        showError(passwordInput, document.getElementById('password-error'));
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Se tudo estiver válido
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
    recoveryEmailInput.value = ''; // Limpar campo após envio
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
        // Limpa os campos ao sair
        userLoginInput.value = '';
        passwordInput.value = '';
    });

    // Mostrar/esconder senha
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
        this.classList.toggle('fa-eye');
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

    // Função para mostrar erros
    function showError(inputElement, errorElement) {
    inputElement.parentElement.parentElement.classList.add('error');
    errorElement.style.display = 'block';
}

    // Função para remover erros
    function hideError(inputElement, errorElement) {
    inputElement.parentElement.parentElement.classList.remove('error');
    errorElement.style.display = 'none';
}   

    // Inicializar mostrando a tela de login
    showScreen(loginScreen);
});