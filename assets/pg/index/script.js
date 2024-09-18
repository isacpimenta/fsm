document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-btn');
    const themeName = document.getElementById('theme-name');
    const themeOverlay = document.getElementById('theme-overlay');
    const themeList = document.getElementById('theme-list');
    const playBtn = document.getElementById('play-btn');

    // Exibir a tela de seleção de tema quando o botão "ESCOLHER TEMA" é clicado
    themeBtn.addEventListener('click', () => {
        themeOverlay.style.display = 'flex'; // Mostrar o overlay
    });

    // Alterar o botão de "ESCOLHER TEMA" para o nome do tema selecionado e esconder o overlay
    themeList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const selectedTheme = e.target.getAttribute('data-theme');
            themeName.textContent = selectedTheme;
            themeOverlay.style.display = 'none'; // Ocultar o overlay
            playBtn.classList.remove('disabled'); // Habilitar o botão "JOGAR"
            playBtn.disabled = false; // Habilitar o botão
        }
    });

    // Adicionar a funcionalidade para fechar o overlay ao clicar fora da área de seleção
    themeOverlay.addEventListener('click', (e) => {
        if (e.target === themeOverlay) {
            themeOverlay.style.display = 'none'; // Ocultar o overlay
        }
    });

    // Navegar para a página do jogo ao clicar no botão "Jogar"
    document.getElementById('play-btn').addEventListener('click', () => {
        const theme = document.getElementById('theme-name').textContent.trim();
        if (theme === 'ESCOLHER TEMA') {
            alert('Por favor, escolha um tema.');
        } else {
            window.location.href = `../game/game.html?theme=${encodeURIComponent(theme)}`;

        }
    });
    
});
