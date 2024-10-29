const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    let filePath = "." + req.url;
    if (filePath === "./") filePath = "./index.html";

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
    };

    const contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === "ENOENT") {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("404 Not Found", "utf-8");
            } else {
                res.writeHead(500);
                res.end("Server error: " + error.code, "utf-8");
            }
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
        }
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
