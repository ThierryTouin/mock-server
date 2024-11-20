import { parse, fileURLToPath } from 'url';
import fs from 'fs';
import http from 'http';
import { dirname } from 'path';
import logger from './utils/logger.js'; // Import du logger externalisé

// Détermine le chemin absolu du fichier
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lecture des routes
let routes = JSON.parse(fs.readFileSync("./mock-routes.json", "utf8"));

var mode = 'test1';

const SERVER_PORT = 7000;

logger.info("----- Routes -----");
logger.info(JSON.stringify(routes, null, 2));
logger.info("----- Routes -----");

function manageMode(req, res, url) {
  logger.info(`manageMode() : req.url=${req.url} url=${url}`);

  // Change mode for dynamic URL
  const queryObject = parse(req.url, true).query;
  mode = queryObject.mode;

  const modeStr = `\n ======> new mode=${mode}`;
  logger.info(modeStr);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(modeStr);
}

function manageResponse(req, res, url) {
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

const requestListener = function (req, res) {
  logger.info(`> req.url=${req.url}`);

  if (req.url.startsWith('/update-mode')) {
    manageMode(req, res, req.url);
  } else if (req.url.startsWith('/mock')) {
    logger.info(`> Dynamique url avec mode=${mode}`);
    const buildUrl = req.url + "/" + mode;
    manageResponse(req, res, buildUrl);
  } else {
    logger.info(`> Static url avec mode=${mode}`);
    manageResponse(req, res, req.url);
  }
};

// Création du serveur HTTP
const server = http.createServer(requestListener);

// Démarrage du serveur
server.listen(SERVER_PORT, () => {
  logger.info(`\nServer is now up @ https://localhost:${SERVER_PORT}\n`);
});
