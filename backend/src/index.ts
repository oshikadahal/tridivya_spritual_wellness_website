import app from './app';
import { PORT } from './config';
import { connectDatabase } from './database/mongodb';
import { AddressInfo } from 'net';

async function startServer() {
  await connectDatabase();

  const maxAttempts = 10;

  const listenWithFallback = (port: number, attemptsLeft: number): void => {
    const server = app.listen(port, '0.0.0.0', () => {
      const address = server.address() as AddressInfo | string | null;
      const runningPort = typeof address === 'object' && address ? address.port : port;
      console.log(`Server running at http://0.0.0.0:${runningPort}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE' && attemptsLeft > 0) {
        const nextPort = port + 1;
        console.warn(`Port ${port} is in use, trying port ${nextPort}...`);
        listenWithFallback(nextPort, attemptsLeft - 1);
        return;
      }

      console.error(error);
      process.exit(1);
    });
  };

  listenWithFallback(PORT, maxAttempts);
}

startServer();