import fs from 'fs';
import parser from 'csv-parser';
import { stringify } from 'csv-stringify/sync';
import { writeFile } from 'fs/promises';

// transforme le fichier CSV en JSON 
export const readCsvFile = () => {
	const filePath = './stock_legacy_full.csv';

	if (!fs.existsSync(filePath)) {
		throw new Error(`Le fichier ${filePath} n'existe pas.`);
	}

	return new Promise((resolve, reject) => {
		const results = [];

		fs.createReadStream(filePath)
			.pipe(parser())
			.on('data', (row) => results.push(tri(row)))
			.on('end', () => resolve(results))
			.on('error', reject);
	});
};

// fait le tri du parsing csv afin de faire un JSON clean facile a manipuler 

function tri(json) {
	const keyString = Object.keys(json)[0];
	const valueString = Object.values(json)[0];
	const keys = keyString.split(';');
	const values = valueString.split(';');

	return Object.fromEntries(
		keys.map((key, i) => [key, values[i] ?? null])
	);
}

// Lance le nettoyage du fichier CSV ! 
function repair_csv(data) {
	nom_console(data);
	etat_jeu(data);
	prix_achat_jeu(data);
	prix_jeu(data);

}
// clean nom des consoles en version raccourcies
function nom_console(data) {
	const mapping_plateforme = {
        // Nintendo
        "Nintendo 64": "N64",
        "N64": "N64",
        "Super Nintendo": "SNES",
        "SNES": "SNES",
        "Super Famicom": "SNES",
        "Game Boy": "GB",
        "GameBoy": "GB",
        "Gameboy Color": "GBC",
        "Game Boy Color": "GBC",
        "Game Boy Advance": "GBA",
        "GBA": "GBA",
        "NES": "NES",
        "Switch": "Switch",
        "GC": "GC",
        "GameCube": "GC",
        "GCN": "GC",

        // Sony PlayStation
        "PlayStation": "PS1",
        "PlayStation 1": "PS1",
        "PS1": "PS1",
        "PSX": "PS1",
        "Playstation": "PS1",
        "Playstation 1": "PS1",
        "PlayStation 2": "PS2",
        "PS2": "PS2",
        "PlayStation 3": "PS3",
        "PS3": "PS3",

        // Sega
        "Sega Mega Drive": "MD",
        "Megadrive": "MD",
        "Genesis": "MD",
        "Master System": "SMS",
        "Dreamcast": "DC",
        "Saturn": "Saturn",

        // Atari
        "Atari 2600": "Atari",

        // PC / Arcade
        "PC": "PC",
        "Arcade": "Arcade",
        "Xbox": "Xbox"
	}
	for (let i = data.length - 1; i >= 0; i--) {
		const plateforme = data[i].plateforme;
		if (mapping_plateforme[plateforme]) {
			data[i].plateforme = mapping_plateforme[plateforme];
		}
	}
}

// clean prix des jeux
function prix_jeu(data) {
    for (let i = 0; i < data.length; i++) {
        let valeur_estimee = data[i].valeur_estimee;

        if (!valeur_estimee) {
            data[i].valeur_estimee = "0 €";
            continue;
        }

        let price = valeur_estimee.toString().trim()
            .replace(/EUR|euros|€/gi, "").trim();

        let value = parseFloat(price.replace(/[^0-9.]/g, ""));
        
        if (isNaN(value)) {
            data[i].valeur_estimee = "0 €";
            continue;
        }

        if (price.includes("¥") || price.toLowerCase().includes("yen")) {
            value *= 0.0075; 
        } else if (price.includes("$")) {
            value *= 0.92; 
        }

        data[i].valeur_estimee = Math.round(value) + " €";
    }
}


// clean etats des jeux
function etat_jeu(data) {
	const mapping_etat = {
		// Excellent
		"Mint": "Excellent",
		"Comme neuf": "Excellent",
		"Neuf": "Excellent",
		"Blister": "Excellent",
		"Platinum": "Excellent",
		"Collector": "Excellent",
		"Steelbook": "Excellent",
		"Big Box": "Excellent",

		// Bon
		"Good": "Bon",
		"Bon": "Bon",
		"Bon etat": "Bon",
		"Excellent": "Bon", 
		"Occasion": "Bon",
		"Use": "Bon",

		// Moyen
		"Moyen": "Moyen",
		"Rayé": "Moyen",
		"Jauni": "Moyen",
		"Loose": "Moyen",
		"Sans boite": "Moyen",
		"Sans notice": "Moyen",
		"Boite abimée": "Moyen",
		"Boite cassee": "Moyen",
		"Cabinet": "Moyen",

		// Mauvais
		"Abimé": "Mauvais",
		"Abime": "Mauvais",
		"Boite manquante": "Mauvais",
		"Pile HS": "Mauvais",
		"Pourri": "poubelle"
		
	};

	for (let i = data.length - 1; i >= 0; i--) {
		const etat = data[i].etat;

		if (mapping_etat[etat]) {
			data[i].etat = mapping_etat[etat];
		if (data[i].etat == "poubelle"){
			data.splice(i, 1);		
		}
		} else {
			data[i].etat = "Mauvais";
		}
	}
}
//clean les prix d'achats
function prix_achat_jeu(data) {
    for (let i = 0; i < data.length; i++) {
        let brainrot = data[i].prix_achat;

        if (!brainrot) {
            data[i].prix_achat = "0 €";
            continue;
        }

        brainrot = brainrot.toString().trim();

        brainrot = brainrot.replace(/EUR|euros|€/gi, "").trim();

        let value = parseFloat(brainrot.replace(/[^0-9.]/g, ""));

        if (isNaN(value)) value = 0;

        if (brainrot.includes("¥") || brainrot.toLowerCase().includes("yen")) {
            value = value * 0.0075; 
        } else if (brainrot.includes("$")) {
            value = value * 0.92; 
        }
        data[i].prix_achat = Math.round(value) + " €";
    }
}

async function cleanAndDownloadCSV() {
    try {
        const data = await readCsvFile();
        repair_csv(data);
        const csvContent = stringify(data, {
            header: true,
            delimiter: ';',
            quoted: true
        }); 
		await writeFile('./Jeu_retro_clean.csv', csvContent);
        console.log(` Terminé ! ${data.length} jeux nettoyés`);
        console.log(' Fichier créé : stock_cleaned.csv');  
    } catch (error) {
        console.log('erreur fichier non valide !')
        process.exit(1);
    }
}

cleanAndDownloadCSV();