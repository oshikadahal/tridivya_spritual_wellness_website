if (process.env.NODE_ENV !== 'test') {
  process.env.NODE_ENV = 'test';
}

if (!process.env.TEST_COLLECTION_PREFIX) {
  process.env.TEST_COLLECTION_PREFIX = 'test_';
}

if (!process.env.TEST_DB_NAME) {
  process.env.TEST_DB_NAME = 'tridivya_wellness_test';
}

if (!process.env.TEST_CLEAR_DB_EACH_TEST) {
  process.env.TEST_CLEAR_DB_EACH_TEST = 'false';
}

// Silence console output for cleaner test runs.
jest.spyOn(console, 'log').mockImplementation(() => undefined);
jest.spyOn(console, 'error').mockImplementation(() => undefined);
jest.spyOn(console, 'warn').mockImplementation(() => undefined);
