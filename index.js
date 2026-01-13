import fs from 'fs';
import parser from 'csv-parser';

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

function tri(json) {
	const keyString = Object.keys(json)[0];
	const valueString = Object.values(json)[0];

	const keys = keyString.split(';');
	const values = valueString.split(';');

	return Object.fromEntries(
		keys.map((key, i) => [key, values[i] ?? null])
	);
}

(async () => {
	const data = await readCsvFile();
	for (let i = 0; data.length>i; i++){
		console.log(data[i].prix_achat);
	}
})();

function repair_csv(data) {
	nom_console(data);
	etat_jeu(data);
	prix_achat_jeu(data);
	prix_jeu(data);

}

function nom_console(data) {
	const mapping_platforme = {
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
		const plateforme = data[i].platforme;
		if (mapping_platforme[plateforme]) {
			data[i].plateforme = mapping_platforme[platforme];
		}
	}
}


function prix_jeu(data) {
    for (let i = 0; i < data.length; i++) {
        let valeur_estimee = data[i].valeur_estimee;

        if (!price) {
            data[i].valeur_estimee = "0 €";
            continue;
        }

        price = valeur_estimee.toString().trim();

        price = valeur_estimee.replace(/EUR|euros|€/gi, "").trim();

        let value = parseFloat(valeur_estimee.replace(/[^0-9.]/g, ""));

        if (valeur_estimee.includes("¥") || valeur_estimee.toLowerCase().includes("yen")) {
            value = value * 0.0075; 
        } else if (valeur_estimee.includes("$")) {
            value = value * 0.92; 
        }

        data[i].valeur_estimee = Math.round(value) + " €";
    }
}





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

function prix_achat_jeu(data) {
    for (let i = 0; i < data.length; i++) {
        let brainrot = data[i].prix_achat;

        if (!brainrot) {
            data[i].price = "0 €";
            continue;
        }

        brainrot = brainrot.toString().trim();

        brainrot = brainrot.replace(/EUR|euros|€/gi, "").trim();

        let value = parseFloat(brainrot.replace(/[^0-9.]/g, ""));

        if (isNaN(value)) value = 0;

        if (brainrot.includes("¥") || brainrot.toLowerCase().includes("yen")) {
            value = value * 0.0075; // YEN → EUR approximatif
        } else if (brainrot.includes("$")) {
            value = value * 0.92; // USD → EUR approximatif
        }

        data[i].price = Math.round(value) + " €";
    }
}

///repair_csv(data);