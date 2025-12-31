const livelli = [
    { id: 1, categoria: "LIGABUE", frase: "IN UN SUO DISCO URLA CONTRO IL CIELO"},
    { id: 2, categoria: "TRECCE", frase: "IN UN DISCO VENGONO SCIOLTE AI CAVALLI" },
    { id: 3, categoria: "IN UFFICIO", frase: "IN PAUSA CAFFE SI SPETTEGOLA TRA COLLEGHI" },
    { id: 4, categoria: "LA SCIMMIA", frase: "IN MOTO INDOSSA IL CASCO DI BANANE" },
    { id: 5, categoria: "METE TURISTICHE", frase: "IN ANDALUSIA CORDOBA E SIVIGLIA" },
    { id: 6, categoria: "OGGETTI MITOLOGICI", frase: "IL VASO SCOPERCHIATO DI PANDORA" },
    { id: 7, categoria: "NEGLI ABISSI", frase: "IL TRIDENTE DI POSEIDONE" }
];

const rowCaps = [12, 14, 14, 12];

function init() {
    renderLevels(livelli);
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toUpperCase();
            const filtered = livelli.filter(l => l.categoria.includes(term));
            renderLevels(filtered);
        });
    }
}

function renderLevels(dataArray) {
    const list = document.getElementById('levels-list');
    if (!list) return;
    list.innerHTML = '';
    dataArray.forEach((liv) => {
        const btn = document.createElement('button');
        btn.className = 'level-btn';
        btn.innerText = `LIV. ${liv.id}: ${liv.categoria}`;
        btn.onclick = () => startGame(livelli.findIndex(l => l.id === liv.id));
        list.appendChild(btn);
    });
}

function startGame(idx) {
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    const data = livelli[idx];
    document.getElementById('categoryDisplay').innerText = data.categoria;
    setupBoard(data.frase);
    setupKeyboard();
}

function setupBoard(frase) {
    const words = frase.split(' ');
    let rowsData = [[], [], [], []];
    let testRow = 0;

    words.forEach(w => {
        let currentRowText = rowsData[testRow].join(' ');
        let spaceNeeded = currentRowText.length > 0 ? 1 : 0;
        if (currentRowText.length + spaceNeeded + w.length > rowCaps[testRow]) {
            if (testRow < 3) testRow++;
        }
        rowsData[testRow].push(w);
    });

    let usedRows = rowsData.filter(r => r.length > 0).length;
    let startAt = usedRows === 1 ? 1 : (usedRows === 2 ? 1 : 0);
    let finalRows = [[], [], [], []];
    let targetRow = startAt;
    rowsData.filter(r => r.length > 0).forEach(data => {
        if (targetRow < 4) finalRows[targetRow++] = data;
    });

    for (let i = 0; i < 4; i++) {
        const tr = document.getElementById(`row-${i+1}`);
        tr.innerHTML = '';
        const txt = finalRows[i].join(' ');
        const pad = Math.floor((rowCaps[i] - txt.length) / 2);
        
        for (let j = 0; j < 14; j++) {
            const td = document.createElement('td');
            if ((i === 0 || i === 3) && (j === 0 || j === 13)) {
                td.className = 'tile offset-tile';
            } else {
                td.className = 'tile';
                const charIndex = (i === 0 || i === 3) ? (j - 1 - pad) : (j - pad);
                const char = txt[charIndex];
                if (char && char !== ' ') {
                    td.classList.add('active');
                    td.dataset.letter = char;
                }
            }
            tr.appendChild(td);
        }
    }
}

function setupKeyboard() {
    const kb = document.getElementById('keyboard');
    kb.innerHTML = '';
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').forEach(l => {
        const b = document.createElement('button');
        b.className = 'key';
        b.innerText = l;
        b.onclick = () => {
            b.disabled = true;
            revealLetter(l);
        };
        kb.appendChild(b);
    });
}
// ... (tutto il resto rimane uguale fino alla funzione revealLetter)

function revealLetter(l) {
    const targets = document.querySelectorAll(`.tile[data-letter="${l}"]`);
    targets.forEach(t => {
        t.classList.add('revealed'); // Aggiunge la classe che rende il testo nero
        t.innerText = l;
    });
}

function revealSolution() {
    if(!confirm("Vuoi visualizzare la soluzione completa?")) return;
    document.querySelectorAll('.tile.active').forEach(t => {
        t.classList.add('revealed');
        t.innerText = t.dataset.letter;
    });
    document.querySelectorAll('.key').forEach(k => k.disabled = true);
}

// ...



window.onload = init;
