import path from "path";
import { createServer } from "./index";
import * as express from "express";

const app = createServer();
const requestedPort = process.env.PORT ? Number(process.env.PORT) : undefined;
const defaultPorts = [3000, 3001, 3002, 8080];

const portsToTry = requestedPort ? [requestedPort] : defaultPorts;

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files
        app.use(express.static(distPath));

// Handle React Router - serve index.html for all non-API routes

        // Handle React Router - serve index.html for all non-API routes (register this last)
        app.get("*", (req, res) => {
          // Don't serve index.html for API routes
          if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
            return res.status(404).json({ error: "API endpoint not found" });
          }

          res.sendFile(path.join(distPath, "index.html"));
        });

async function startWithFallback(ports: number[]) {
  for (const p of ports) {
    const server = await new Promise<import('net').Server | null>((resolve, reject) => {
      const s = app.listen(p);
      s.once('listening', () => resolve(s));
      s.once('error', (err: any) => reject(err));
    }).catch((err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.warn(`Port ${p} in use, trying next port...`);
        return null;
      }
      throw err;
    });

    if (server) {
      const actualPort = (server.address() as any).port;
      console.log(`🚀 Fusion Starter server running on port ${actualPort}`);
      console.log(`📱 Frontend: http://localhost:${actualPort}`);
      console.log(`🔧 API: http://localhost:${actualPort}/api`);
      return;
    }
  }

  throw new Error('No available ports found to start the server.');
}

startWithFallback(portsToTry).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
