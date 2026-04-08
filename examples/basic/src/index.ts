/**
 * Basic useless bot Example
 * 
 * This example demonstrates the fundamental usage of useless bot.
 * Watch as nothing happens, beautifully.
 */

import { createUselessBot } from '@useless/core';
import { sleep, noop } from '@useless/utils';

async function main() {
  console.log('🤖 Welcome to useless bot!\n');

  // Create a new useless bot instance
  console.log('Creating useless bot instance...');
  const app = createUselessBot({
    mode: 'development',
    debug: true,
  });

  // Initialize
  console.log('Initializing...');
  await app.initialize();
  console.log(`Status: ${app.getStatus()}\n`);

  // Run the useless bot
  console.log('Running useless bot...');
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
  console.log('useless bot destroyed. It was never there anyway.');
}

// Run the example
main().catch((error) => {
  console.error('Error in useless bot:', error);
  process.exit(1);
});
