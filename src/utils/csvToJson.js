import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const SEP = ';';


/**
 * Convertit un fichier CSV en un objet JSON.
 * @param {string} csvFilePath - Le chemin du fichier CSV à convertir.
 * @returns {Array} - Le tableau d'objets JSON correspondant.
 */
function csvToJson(csvFilePath) {
  const csvData = fs.readFileSync(csvFilePath, 'utf8');
  const lines = csvData.split('\n');
  const headers = lines[0].split(SEP);
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(SEP);

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j];
    }

    result.push(obj);
  }

  return result;
}

function completeRoutes(routes, name) {

  routes[`/${name}`] = `/data/${name}/data.json`;

}

/**
 * Convertit tous les fichiers CSV dans un répertoire en fichiers JSON dans une arborescence structurée.
 * @param {string} csvPath - Le chemin du répertoire contenant les fichiers CSV.
 */
export function convertCsvsInDirectory(routes, csvPath, jsonPath) {

  logger.info("----- csv to json -----");
  logger.info(`csvPath = '${csvPath}'`);
  logger.info(`jsonPath = '${jsonPath}'`);
  logger.info("-----------------------");

  // Vérifie que le répertoire existe
  if (!fs.existsSync(csvPath)) {
    console.log(`Le répertoire ${csvPath} n'existe pas.`);
    return;
  }

  // Parcourt tous les fichiers du répertoire
  const files = fs.readdirSync(csvPath);
  
  files.forEach(file => {
    const filePath = path.join(csvPath, file);

    // Si c'est un fichier CSV, on le convertit en JSON
    if (file.endsWith('.csv') && fs.statSync(filePath).isFile()) {
      const jsonData = csvToJson(filePath);

      // Crée le répertoire pour le fichier JSON si nécessaire
      var name = path.parse(file).name;
      logger.info(`Work for ='${name}'`);
      const jsonDirectory = path.join(jsonPath, name );
      if (!fs.existsSync(jsonDirectory)) {
        fs.mkdirSync(jsonDirectory);
      }

      // Sauvegarde le fichier JSON dans le répertoire approprié
      const jsonFilePath = path.join(jsonDirectory, 'data.json');

      logger.info(`Make file='${jsonFilePath}'`);

      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

      console.log(`Fichier JSON généré : ${jsonFilePath}`);

      completeRoutes(routes, name);
      
    }
  });

  return routes;
}
