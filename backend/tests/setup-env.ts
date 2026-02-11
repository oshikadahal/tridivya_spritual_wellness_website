if (process.env.NODE_ENV !== 'test') {
  process.env.NODE_ENV = 'test';
}

// Silence console output for cleaner test runs.
jest.spyOn(console, 'log').mockImplementation(() => undefined);
jest.spyOn(console, 'error').mockImplementation(() => undefined);
jest.spyOn(console, 'warn').mockImplementation(() => undefined);
