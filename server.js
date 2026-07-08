const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const rootDir = __dirname;
const port = Number(process.env.PORT || 8000);
const host = process.env.HOST || "0.0.0.0";

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);

    serveStatic(requestUrl, res);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, {
      message: "服务暂时不可用，请稍后再试。"
    });
  }
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});

function serveStatic(requestUrl, res) {
  const pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname.startsWith("/data/")) {
    const fileName = pathname.slice("/data/".length);
    const allowedFiles = new Set(["questions.json", "scoring.json", "reports.json"]);

    if (!allowedFiles.has(fileName)) {
      sendText(res, 404, "Not found");
      return;
    }

    sendFile(res, path.join(rootDir, "data", fileName));
    return;
  }

  if (pathname === "/" || pathname === "/index.html") {
    sendFile(res, path.join(rootDir, "index.html"));
    return;
  }

  if (pathname === "/start") {
    redirect(res, "/start/");
    return;
  }

  if (pathname === "/start/") {
    sendFile(res, path.join(rootDir, "start", "index.html"));
    return;
  }

  if (pathname === "/quiz") {
    redirect(res, "/quiz/");
    return;
  }

  if (pathname === "/quiz/") {
    sendFile(res, path.join(rootDir, "quiz", "index.html"));
    return;
  }

  if (pathname === "/result") {
    redirect(res, "/result/");
    return;
  }

  if (pathname === "/result/") {
    sendFile(res, path.join(rootDir, "result", "index.html"));
    return;
  }

  sendText(res, 404, "Not found");
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType =
    {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml"
    }[ext] || "application/octet-stream";

  res.writeHead(200, {
    "Content-Type": mimeType
  });
  fs.createReadStream(filePath).pipe(res);
}

function redirect(res, location) {
  res.writeHead(301, {
    Location: location
  });
  res.end();
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(data));
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8"
  });
  res.end(text);
}
