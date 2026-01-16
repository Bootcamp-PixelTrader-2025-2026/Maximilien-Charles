const gamesUrl = 'http://localhost:8000/API/games.php';
const stockUrl = 'http://localhost:8000/API/stock_values.php';
const ul = document.getElementById('jeux');
const filtreEtat = document.getElementById('filtreEtat');

function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function chargerJeux(etat = 'tous') {
    ul.innerHTML = '';
    
    let url;
    if (etat === "" || etat === "tous") {
        url = gamesUrl;
    } else {
        url = `${gamesUrl}?etat=${etat}`;
    }
    
    // Appeler les deux APIs en parallèle
    Promise.all([
        fetch(url).then(resp => resp.json()),
        fetch(stockUrl).then(resp => resp.json())
    ])
    .then(([gamesData, stockData]) => {
        if (gamesData.success && stockData.success) {
            const jeux = gamesData.data;
            const stocks = stockData.data;
            
            // Créer un map des stocks par game_id
            const stockMap = {};
            stocks.forEach(stock => {
                stockMap[stock.game_id] = stock; 
            });
            
            // Afficher les jeux avec leurs infos de stock
            jeux.forEach(jeu => {
                const li = createNode('li');
                const span = createNode('span');
                
                li.addEventListener("click", () => {
                    window.location.href = `details.html?id=${jeu.id}`;
                });
                
                // Récupérer les infos de stock correspondantes
                const stock = stockMap[jeu.id] || {};
                const prixAchat = stock.prix_achat || 'N/A';
                const valeurEstimee = stock.valeur_estimee || 'N/A';
                
                span.innerHTML = `${jeu.titre_jeu} <br>
                <br>
                <br>
                Prix d'achat : ${prixAchat}€ <br>
                <br>
                Valeur estimée : ${valeurEstimee}€`;
                
                append(li, span);
                append(ul, li);
            });
        } else {
            console.error("Erreur : Une des APIs retourne success = false");
        }
    })
    .catch(error => {
        console.error("Erreur fetch:", error);
    });
}

filtreEtat.addEventListener('change', () => {
    chargerJeux(filtreEtat.value);
});

// Chargement initial
chargerJeux();