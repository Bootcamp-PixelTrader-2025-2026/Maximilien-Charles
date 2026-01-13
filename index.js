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
	console.log(data[0].titre_jeu);
})();
