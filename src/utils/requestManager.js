import path from 'path';
import fs from 'fs';
import { parse } from 'url';

import logger from './logger.js'; 
import { convertCsvsInDirectory } from './csvToJson.js';

// Détermine le chemin absolu du fichier
const __dirname = "/usr/src/app/";

// Lecture des routes
const ROUTES_PATH_FILES = path.join(__dirname, "data/mock-routes.json");
let routes = JSON.parse(fs.readFileSync(ROUTES_PATH_FILES, "utf8"));

export function displayRoute() {
  var routesStr = JSON.stringify(routes, null, 2);

  logger.info("----- Routes -----");
  logger.info(routesStr);
  logger.info("-----------------");

  return routesStr;
}

export function generateJson() {
  logger.info(`generateJson()`);

  const csvPath = path.join(__dirname, "csv");

  const jsonPath = path.join(__dirname, "data");

  // Appel de la fonction pour convertir les CSV en JSON
  convertCsvsInDirectory(routes, csvPath, jsonPath);

  const result = `ok`;
  logger.info(result);
  return result;
}

export function manageMode(req, res, url, mode) {
  logger.info(`manageMode() : req.url=${req.url} url=${url}`);

  // Change mode for dynamic URL
  const queryObject = parse(req.url, true).query;
  mode = queryObject.mode;

  const modeStr = `\n ======> new mode=${mode}`;
  logger.info(modeStr);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(modeStr);

  return mode;
}

export function manageResponse(req, res, url) {
  logger.info(`manageResponse() : ${url} -> ${routes[url]}`);

  // Read file only if route matched
  if (routes[url]) {
    res.setHeader("custom-header", 999999);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(fs.readFileSync(__dirname + routes[url], "utf8"));
  } else {
    logger.warn(`Route non trouvée : ${url}`);
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
}
