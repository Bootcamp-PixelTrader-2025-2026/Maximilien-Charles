import fs from 'fs';
import parser from 'csv-parser';

export const readCsvFile = () => {
	const filePath = './stock_legacy_full.csv';
	const fileExists = fs.readFileSync(filePath);

	if (!fileExists) {
		throw new Error(`Le fichier ${filePath} n'existe pas.`);
	}

	let results = [];
	fs.createReadStream(filePath)
		.pipe(parser())
		.on('data', (row) => results.push(row))
		.on('end', () => {
			console.log(results);
		});
};

readCsvFile();