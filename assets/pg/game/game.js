const board = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const modal = document.getElementById('win-modal'); // Modal de vitória
const menuBtn = document.getElementById('menu-btn'); // Botão para voltar ao menu
const rankingBtn = document.getElementById('ranking-btn'); // Botão para ver ranking

const numRows = 4;
const numCols = 3;
const numPairs = (numRows * numCols) / 2;
const basePoints = 10; // Pontos base por completar o jogo

let theme = '';
let imagePaths = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let startTime = null;
let timerInterval = null;

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function startGame() {
    theme = getQueryParam('theme');
    if (!theme) {
        window.location.href = 'index.html'; // Redireciona de volta se não houver tema
    } else {
        createBoard(); // Cria o tabuleiro
    }
}

function createBoard() {
    board.innerHTML = ''; // Limpa o tabuleiro
    matchedPairs = 0; // Zera o contador de pares combinados
    startTime = null; // Reseta o tempo inicial
    clearInterval(timerInterval); // Reseta o temporizador
    timerElement.textContent = 'Tempo: 00:00'; // Reseta a exibição do tempo

    loadImages(); // Carrega as imagens com base no tema selecionado
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = imagePaths[i * numCols + j];
            card.addEventListener('click', flipCard);
            board.appendChild(card);
        }
    }
}

function loadImages() {
    const themeImages = {
        'grego': ['card1', 'card2', 'card3', 'card4', 'card5', 'card6'],
        'nordico': ['card1', 'card2', 'card3', 'card4', 'card5', 'card6']
    };

    const images = themeImages[theme];
    imagePaths = [];

    if (images) {
        images.forEach(image => {
            imagePaths.push(`../../img/${theme}/${image}.png`, `../../img/${theme}/${image}.png`);
        });

        imagePaths.sort(() => Math.random() - 0.5); // Aleatoriza as imagens
    }
}

function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('flipped')) return;

    if (!startTime) {
        startTime = Date.now(); // Inicia o temporizador ao virar a primeira carta
        startTimer(); // Começa a contagem
    }

    this.classList.add('flipped');
    this.style.backgroundImage = `url(${this.dataset.image})`;

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        lockBoard = true;
        checkForMatch();
    }
}

function checkForMatch() {
    if (firstCard.dataset.image === secondCard.dataset.image) {
        matchedPairs++;
        resetBoard();
        if (matchedPairs === numPairs) {
            clearInterval(timerInterval); // Para o temporizador quando todas as cartas forem combinadas
            const totalTime = Date.now() - startTime; // Calcula o tempo total
            calculatePoints(totalTime); // Calcula a pontuação com base no tempo
            showWinModal(); // Exibe o modal ao vencer
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.style.backgroundImage = '';
            secondCard.style.backgroundImage = '';
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Função para iniciar o temporizador
function startTimer() {
    timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);

        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

        timerElement.textContent = `Tempo: ${formattedMinutes}:${formattedSeconds}`;
    }, 1000); // Atualiza a cada segundo
}

// Função para calcular os pontos com base no tempo
function calculatePoints(totalTime) {
    const seconds = totalTime / 1000; // Tempo total em segundos
    let multiplier = 1;

    if (seconds <= 10) {
        multiplier = 10;
    } else if (seconds <= 15) {
        multiplier = 5;
    }

    const finalPoints = basePoints * multiplier;
    saveScore(finalPoints, seconds);
}

// Função para salvar a pontuação no localStorage
function saveScore(points, time) {
    const scores = JSON.parse(localStorage.getItem('ranking')) || [];
    const newScore = {
        theme: theme,
        points: points,
        time: time.toFixed(2) + 's'
    };
    scores.push(newScore);
    localStorage.setItem('ranking', JSON.stringify(scores));
}

// Função para exibir o modal de vitória
function showWinModal() {
    modal.style.display = 'flex';
}

// Event listeners para os botões do modal
menuBtn.addEventListener('click', () => {
    window.location.href = '../index/index.html'; // Redireciona para o menu principal
});

rankingBtn.addEventListener('click', () => {
    window.location.href = '../rank/rank.html'; // Redireciona para a página de ranking
});

// Inicia o jogo quando a página é carregada
startGame();
