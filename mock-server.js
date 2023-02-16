const http = require("http");
const fs = require("fs");
const url = require('url');

let routes = JSON.parse(fs.readFileSync("./mock-routes.json", "utf8"));

var mode = 'test1';

console.log("----- Routes -----");
console.log(routes);
console.log("----- Routes -----");

function manageResponse(req, res, url) {

    console.log("\n", url , " -> ", routes[url]);

    // Read file only if route matched
    if (routes[url]) {
        res.setHeader("custom-header", 999999);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(fs.readFileSync(__dirname + routes[url], "utf8"));
      } else {
        res.writeHead(404, { "Content-Type": "applciation/json" });
        res.end();
      }  
}


const requestListener = function (req, res) {

  console.log("\n req.url=", req.url);

  if (req.url.startsWith('/update-mode')) {
    // change mode for dynamique url
    const queryObject = url.parse(req.url, true).query;
    mode = queryObject.mode;
    console.log("\n ======> new mode=",mode);
    res.end();
  } if (req.url.startsWith('/mock')) {
    // dynamique url
    console.log("\n mode=",mode);
    var buildUrl = req.url + "/" + mode;
    manageResponse(req, res, buildUrl);
  } else {
    // static response
    manageResponse(req, res, req.url);
  }
};

// pass on the request listener
const server = http.createServer(requestListener);

// set port number as per choice
server.listen(7000);
