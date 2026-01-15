const params = new URLSearchParams(window.location.search);
const id = params.get('id');


const url = `http://localhost/bootcamp/api/games.php?id=${id}`;
const ul = document.getElementById('jeu');

function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

fetch(url)
    .then(resp => resp.json())
    .then(data => {
        if (data.success) {
            let jeu = data.data; 
            let li = createNode('li');
            let span = createNode('span');
            span.innerHTML = `${jeu.titre_jeu} - ${jeu.plateforme} - ${jeu.annee_sortie} - ${jeu.etat} - ${jeu.emplacement}`;
            append(li, span);
            append(ul, li);
        } else {
            console.error("erreur : API retourne success = false ");
        }
    })
    .catch(error => {
        console.error("Erreur fetch", error);
    });
