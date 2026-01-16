const baseUrl = 'http://localhost:8000/API/games.php';
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
        url = baseUrl;
    } else {
        url = `${baseUrl}?etat=${etat}`;
    }
    
    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            if (data.success) {
                data.data.forEach(jeu => {
                    const li = createNode('li');
                    const span = createNode('span');
                    
                    li.addEventListener("click", () => {
                        window.location.href = `details.html?id=${jeu.id}`;
                    });
                    
                    span.innerHTML = `${jeu.titre_jeu}`;
                    
                    append(li, span);
                    append(ul, li);
                });
            } else {
                console.error("Erreur : API retourne success = false");
            }
        })
        .catch(error => {
            console.error("Erreur fetch:", error);
        });
}

filtreEtat.addEventListener('change', () => {
    chargerJeux(filtreEtat.value);
});

chargerJeux();