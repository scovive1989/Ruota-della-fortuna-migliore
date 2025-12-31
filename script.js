const livelli = [
    { id: 1, categoria: "LIGABUE", frase: "IN UN SUO DISCO URLA CONTRO IL CIELO" },
    { id: 2, categoria: "TRECCE", frase: "IN UN DISCO VENGONO SCIOLTE AI CAVALLI" },
    { id: 3, categoria: "IN UFFICIO", frase: "IN PAUSA CAFFE SI SPETTEGOLA TRA COLLEGHI" },
    { id: 4, categoria: "LA SCIMMIA", frase: "IN MOTO INDOSSA IL CASCO DI BANANE" },
    { id: 5, categoria: "METE TURISTICHE", frase: "IN ANDALUSIA CORDOBA E SIVIGLIA" },
    { id: 6, categoria: "OGGETTI MITOLOGICI", frase: "IL VASO SCOPERCHIATO DI PANDORA" },
    { id: 7, categoria: "NEGLI ABISSI", frase: "IL TRIDENTE DI POSEIDONE" }
];

const rowCaps = [12, 14, 14, 12];

function init() {
    const list = document.getElementById('levels-list');
    if(!list) return;
    
    renderLevels(livelli);

    // LOGICA DI RICERCA: Filtra i bottoni in tempo reale
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toUpperCase();
            const filtered = livelli.filter(l => l.categoria.includes(term));
            renderLevels(filtered);
        });
    }
}

// Funzione per disegnare la lista dei bottoni
function renderLevels(dataArray) {
    const list = document.getElementById('levels-list');
    if (!list) return;
    
    list.innerHTML = '';
    dataArray.forEach((liv) => {
        const originalIndex = livelli.findIndex(l => l.id === liv.id);
        
        const btn = document.createElement('button');
        btn.className = 'level-btn';
        btn.innerText = `LIV. ${liv.id}: ${liv.categoria}`;
        btn.onclick = () => startGame(originalIndex);
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

// Rivela tutta la frase (Tasto Soluzione)
function revealSolution() {
    if(!confirm("Vuoi visualizzare la soluzione completa?")) return;
    
    const activeTiles = document.querySelectorAll('.tile.active');
    activeTiles.forEach(tile => {
        const letter = tile.dataset.letter;
        if (letter) {
            tile.innerText = letter;
            tile.style.backgroundColor = "white";
        }
    });

    // Disabilita i tasti della tastiera
    const keys = document.querySelectorAll('.key');
    keys.forEach(k => k.disabled = true);
}

function setupBoard(frase) {
    const words = frase.split(' ');
    let rowsData = [[], [], [], []];
    let testRow = 0;

    // 1. Distribuzione virtuale per capire quante righe servono
    words.forEach(w => {
        let currentRowText = rowsData[testRow].join(' ');
        let spaceNeeded = currentRowText.length > 0 ? 1 : 0;
        if (currentRowText.length + spaceNeeded + w.length > rowCaps[testRow]) {
            if (testRow < 3) testRow++;
        }
        rowsData[testRow].push(w);
    });

    // 2. Calcolo offset verticale (Centratura automatica)
    let usedRows = rowsData.filter(r => r.length > 0).length;
    let finalRows = [[], [], [], []];
    let startAt = 0;

    if (usedRows === 1) startAt = 1; 
    else if (usedRows === 2) startAt = 1; 
    else if (usedRows === 3) startAt = 0;
    else startAt = 0;

    let targetRow = startAt;
    rowsData.filter(r => r.length > 0).forEach(data => {
        if (targetRow < 4) {
            finalRows[targetRow] = data;
            targetRow++;
        }
    });

    // 3. Generazione fisica delle caselle sul tabellone
    for (let i = 0; i < 4; i++) {
        const tr = document.getElementById(`row-${i+1}`);
        tr.innerHTML = '';
        
        const txt = finalRows[i].join(' ');
        const pad = Math.floor((rowCaps[i] - txt.length) / 2);
        const totalSlots = 14; 
        
        for (let j = 0; j < totalSlots; j++) {
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
            const targets = document.querySelectorAll(`.tile[data-letter="${l}"]`);
            targets.forEach(t => {
                t.innerText = l;
                t.style.backgroundColor = "white";
            });
        };
        kb.appendChild(b);
    });
}

window.onload = init;
