import createApp from '../src/app.js';

const app = createApp();
if (typeof app?.listen !== 'function') {
  throw new Error('Express app did not initialize correctly');
}

console.log('Express app bootstrapped successfully.');
