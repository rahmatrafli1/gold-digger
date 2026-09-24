import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MIME_TYPES } from "../helpers/mimeTypes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");

export function serveStatic(req, res) {
  const filePath = path.join(
    PUBLIC_DIR,
    req.url === "/" ? "index.html" : req.url,
  );
  const contentType =
    MIME_TYPES[path.extname(filePath)] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) return res.writeHead(404).end("404 Not Found");
    res.writeHead(200, { "Content-Type": contentType }).end(data);
  });
}
