const rankingTable = document.getElementById('ranking-table');
const backBtn = document.getElementById('back-btn');

// Função para carregar e exibir o ranking
function loadRanking() {
    const scores = JSON.parse(localStorage.getItem('ranking')) || [];

    if (scores.length === 0) {
        rankingTable.innerHTML = '<p>Nenhuma pontuação registrada ainda.</p>';
        return;
    }

    const table = document.createElement('table');
    const header = `
        <tr>
            <th>Tema</th>
            <th>Pontos</th>
            <th>Tempo</th>
        </tr>
    `;
    table.innerHTML = header;

    scores.forEach(score => {
        const row = `
            <tr>
                <td>${score.theme}</td>
                <td>${score.points}</td>
                <td>${score.time}</td>
            </tr>
        `;
        table.innerHTML += row;
    });

    rankingTable.appendChild(table);
}

// Botão para voltar ao menu principal
backBtn.addEventListener('click', () => {
    window.location.href = '../index/index.html';
});

// Carrega o ranking ao carregar a página
loadRanking();
