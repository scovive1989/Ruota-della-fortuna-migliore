function revealLetter(l) {
    // Mappa delle lettere accentate
    const mapping = {
        'A': ['A', 'À', 'Á', 'Â', 'Ã'],
        'E': ['E', 'È', 'É', 'Ê', 'Ë'],
        'I': ['I', 'Ì', 'Í', 'Î', 'Ï'],
        'O': ['O', 'Ò', 'Ó', 'Ô', 'Õ'],
        'U': ['U', 'Ù', 'Ú', 'Û', 'Ü']
    };

    // Se la lettera cliccata ha varianti, le cerchiamo tutte, altrimenti cerchiamo solo la lettera stessa
    const targetsToSearch = mapping[l] || [l];
    
    let foundAny = false;
    const activeTiles = document.querySelectorAll('.tile.active');

    activeTiles.forEach(t => {
        // Prendiamo la lettera salvata nella cella (es. 'À')
        const charInTile = t.dataset.letter.toUpperCase();
        
        // Se la lettera della cella è tra quelle che stiamo cercando
        if (targetsToSearch.includes(charInTile)) {
            t.classList.add('revealed');
            t.innerText = t.dataset.letter; // Mostra la lettera originale con l'accento
            foundAny = true;
        }
    });

    // Dopo aver rivelato le lettere, controlliamo se il giocatore ha vinto
    if (foundAny) {
        checkWin();
    }
}

function checkWin() {
    // Controlliamo se ci sono ancora celle attive che NON sono state rivelate
    const remaining = document.querySelectorAll('.tile.active:not(.revealed)');
    
    if (remaining.length === 0) {
        // Usiamo un piccolo timeout per permettere al CSS di mostrare l'ultima lettera
        setTimeout(() => {
            alert("COMPLIMENTI! HAI INDOVINATO LA FRASE!");
            // Opzionale: puoi aggiungere qui il ritorno al menu o il passaggio al livello successivo
            // location.reload(); 
        }, 500);
    }
}

function revealSolution() {
    if(!confirm("Vuoi visualizzare la soluzione completa?")) return;
    document.querySelectorAll('.tile.active').forEach(t => {
        t.classList.add('revealed');
        t.innerText = t.dataset.letter;
    });
    document.querySelectorAll('.key').forEach(k => k.disabled = true);
}

window.onload = init;
