/**
 * Basic Void Example
 * 
 * This example demonstrates the fundamental usage of the Void framework.
 * Watch as nothing happens, beautifully.
 */

import { createVoid } from '@void/core';
import { sleep, noop } from '@void/utils';

async function main() {
  console.log('🌌 Welcome to the Void!\n');

  // Create a new Void instance
  console.log('Creating Void instance...');
  const app = createVoid({
    mode: 'development',
    debug: true,
  });

  // Initialize
  console.log('Initializing...');
  await app.initialize();
  console.log(`Status: ${app.getStatus()}\n`);

  // Run the void
  console.log('Running the Void...');
  await app.run();

  // Get the result
  const result = app.getResult();
  console.log(`Result: ${result}`);
  console.log('(As expected, nothing!)\n');

  // Do some additional nothing
  console.log('Performing additional operations...');
  await sleep(500);
  noop();
  await sleep(500);

  console.log('✨ Success! You have successfully accomplished nothing.');
  console.log('🎉 You will own nothing and be happy.\n');

  // Clean up (also does nothing)
  await app.destroy();
  console.log('Void destroyed. It was never there anyway.');
}

// Run the example
main().catch((error) => {
  console.error('Error in the void:', error);
  process.exit(1);
});
