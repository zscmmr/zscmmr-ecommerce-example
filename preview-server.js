const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const contentTypes = {
	".css": "text/css; charset=utf-8",
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
};

http.createServer((request, response) => {
	let pathname;

	try {
		pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
	} catch {
		response.writeHead(400);
		response.end("Bad request");
		return;
	}

	if (pathname.endsWith("/")) {
		pathname += "index.html";
	}

	const filePath = path.resolve(root, `.${pathname}`);
	const relativePath = path.relative(root, filePath);

	if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
		response.writeHead(403);
		response.end("Forbidden");
		return;
	}

	fs.readFile(filePath, (error, content) => {
		if (error) {
			response.writeHead(error.code === "ENOENT" ? 404 : 500);
			response.end(error.code === "ENOENT" ? "Not found" : "Unable to read file");
			return;
		}

		response.writeHead(200, {
			"Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
		});
		response.end(content);
	});
}).listen(4173, "127.0.0.1", () => {
	console.log("ZSCMMR preview available at http://127.0.0.1:4173");
});
