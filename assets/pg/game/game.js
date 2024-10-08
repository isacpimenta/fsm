const board = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const modal = document.getElementById('win-modal');
const Startmodal = document.getElementById('start-modal');
const menuBtn = document.getElementById('menu-btn');
const rankingBtn = document.getElementById('ranking-btn');
const submitBtn = document.getElementsByClassName('btn')[0]; // Acessa o primeiro botão da classe 'btn'

var form = document.getElementById('formulario');
var campo = document.getElementById('ipname');

const numRows = 4;
const numCols = 3;
const numPairs = (numRows * numCols) / 2;
const basePoints = 10;

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
        window.location.href = '../../../index.html'; 
    } else {
        showStartModal();
    }
}

function createBoard() {
    board.innerHTML = '';
    matchedPairs = 0;
    resetTimer();

    loadImages();
    imagePaths.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        // Definir o caminho completo da imagem diretamente no dataset
        card.dataset.image = `../../img/${theme}/${image}.png`;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function loadImages() {
    const themeImages = {
        'AMOREMITOLOGIA': ['card1', 'card2', 'card3', 'card4', 'card5', 'card6'],
        'PREHISTORIAEIDADEANTIGA': ['card1', 'card2', 'card3', 'card4', 'card5', 'card6'],
        'IDADEMÉDIA': ['card1', 'card2', 'card3', 'card4', 'card5', 'card6'],
        'IDADEMODERNA': ['card1', 'card2', 'card3', 'card4', 'card5', 'card6'],
        'SOCIEDADEDECONSUMO': ['card1', 'card2', 'card3', 'card4', 'card5', 'card6'],
        'AMORESLIQUIDOS': ['card1', 'card2', 'card3', 'card4', 'card5', 'card6']
    };

    // Verifique se as imagens para o tema estão definidas corretamente
    const images = themeImages[theme] || [];

    // Limpar a lista de imagePaths para garantir que as imagens corretas sejam carregadas
    imagePaths = [];

    images.forEach(image => {
        // Agora, adicione o caminho completo das imagens
        imagePaths.push(`${image}`, `${image}`);
    });

    // Embaralhar as cartas
    imagePaths.sort(() => Math.random() - 0.5);
}



function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('flipped')) return;

    if (!startTime) {
        startTime = Date.now(); 
        startTimer();
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
            clearInterval(timerInterval);
            const totalTime = Date.now() - startTime;
            calculatePoints(totalTime);
            showWinModal();
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

function startTimer() {
    timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);

        // Atualiza o temporizador na tela
        timerElement.textContent = `Tempo: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Verifica se o tempo passou de 25 segundos
        if (elapsedTime >= 25000) { // 25000 ms = 25 segundos
            endGame(); // Função que encerra o jogo
        }
    }, 1000); // Atualiza a cada segundo
}


// Função para encerrar o jogo quando o tempo limite for atingido
function endGame() {
    clearInterval(timerInterval); // Para o temporizador
    lockBoard = true; // Impede mais interações com o tabuleiro
    alert('O tempo acabou! O jogo foi encerrado após 25 segundos.'); // Mensagem de fim de jogo
    
    window.location.href = '../../../index.html';
}


function resetTimer() {
    startTime = null;
    clearInterval(timerInterval);
    timerElement.textContent = 'Tempo: 00:00';
}

form.addEventListener('submit', function(e) {
    // Impede o envio do form para que não ocorra um refresh da página
    e.preventDefault();

    // Captura o nome do campo de input
    var nome = ipname.value;

    if (nome.trim() !== '') {
        // O nome foi inserido corretamente, então podemos fechar o modal de início
        Startmodal.style.display = 'none';

        // Agora o jogo pode começar
        createBoard();
    } else {
        alert('Por favor, insira um nome para começar o jogo.');
    }
});


function calculatePoints(totalTime) {
    const seconds = totalTime / 1000;
    let multiplier = 1;

    if (seconds <= 10) {
        multiplier = 10;
    } else if (seconds <= 15) {
        multiplier = 5;
    }

    const finalPoints = basePoints * multiplier;
    const nome = campo.value;
    
    saveScore(finalPoints, seconds, nome);
}

function saveScore(points, time, nome) {
    const scores = JSON.parse(localStorage.getItem('ranking')) || [];
    const newScore = {
        nome: nome,
        theme: theme,
        points: points,
        time: time.toFixed(2) + 's'
    };
    scores.push(newScore);
    localStorage.setItem('ranking', JSON.stringify(scores));
}

function showWinModal() {
    modal.style.display = 'flex';
}

function showStartModal() {
    Startmodal.style.display = 'flex';
}

menuBtn.addEventListener('click', () => {
    window.location.href = '../../../index.html';
});

rankingBtn.addEventListener('click', () => {
    window.location.href = '../rank/rank.html';
});

startGame();