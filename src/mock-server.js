import http from 'http';
import logger from './utils/logger.js'; 
import { displayRoute, manageMode, manageResponse, generateJson  } from './utils/requestManager.js';

const SERVER_PORT = 7000;
const DEFAULT_MODE = 'test1';

var mode = DEFAULT_MODE;

const requestListener = function (req, res) {
  logger.info(`> req.url=${req.url}`);

  if (req.url.startsWith('/get-routes')) {
    var result = displayRoute();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(result);

  } else if (req.url.startsWith('/update-mode')) {
    mode = manageMode(req, res, req.url, mode);
  } else if (req.url.startsWith('/mock')) {
    logger.info(`> Use dynamique url avec mode=${mode}`);
    const buildUrl = req.url + "/" + mode;
    manageResponse(req, res, buildUrl);
  } else {
    logger.info(`> Use static url ! `);
    manageResponse(req, res, req.url);
  }
};

displayRoute();
generateJson();
displayRoute();
// Création du serveur HTTP
const server = http.createServer(requestListener);

// Démarrage du serveur
server.listen(SERVER_PORT, () => {
  logger.info(`> Server is now up @ https://localhost:${SERVER_PORT}\n`);
});
