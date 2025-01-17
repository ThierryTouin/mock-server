## Link
https://cybercafe.dev/creating-simple-mock-api-server-using-nodejs/

## New official command
```
./cmd.sh
```

## Start the server whitout docker
```
node mock-server.js
```

## Url
http://localhost:7000/user-service/user/1234567890


## Change mode
http://localhost:7000/update-mode?mode=test1
http://localhost:7000/update-mode?mode=test2


http://localhost:7000/mock (suivant le mode) 


## Vrac code

  // For various static resources
  if (req.url.includes("fonts")) {
    contentType = "application/x-font-ttf";
    path = path + "/fonts/";
  } else if (req.url.includes("img")) {
    contentType = "image/svg+xml";
    path = path + "/images/";
  } else if (req.url.includes("png")) {
    contentType = "image/png";
    path = path + "/images/";
  } else {
    contentType = "application/json";
    encoding = "utf8";
  }