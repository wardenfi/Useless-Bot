# @void/core

The core framework functionality for Void. This package provides the fundamental building blocks for creating nothing.

## Installation

```bash
npm install @void/core
# or
yarn add @void/core
# or
pnpm add @void/core
```

## Usage

```typescript
import { createVoid, VoidOptions } from '@void/core';

// Create a new Void instance
const app = createVoid({
  mode: 'production',
  debug: false
});

// Initialize the void
await app.initialize();

// Run the void
await app.run();

// Get the result (spoiler: it's nothing)
const result = app.getResult();
console.log(result); // undefined
```

## API

### `createVoid(options?): VoidInstance`

Creates a new Void instance with optional configuration.

#### Options

- `mode` - The mode to run in (`'development'` | `'production'`)
- `debug` - Enable debug logging (default: `false`)
- `plugins` - Array of plugins to load

#### Returns

A `VoidInstance` with the following methods:

- `initialize()` - Initializes the void (does nothing, but asynchronously)
- `run()` - Runs the void (also does nothing)
- `destroy()` - Destroys the void (nothing was there anyway)
- `getResult()` - Gets the result (always `undefined`)
- `getStatus()` - Gets the current status (always `'ready'`)

### `isVoid(value): boolean`

Checks if a value is a Void instance.

```typescript
import { createVoid, isVoid } from '@void/core';

const app = createVoid();
console.log(isVoid(app)); // true
console.log(isVoid({})); // false
```

### `VoidError`

The base error class for all Void-related errors. Useful for error handling in your nothing.

```typescript
import { VoidError } from '@void/core';

try {
  // Your code that does nothing
} catch (error) {
  if (error instanceof VoidError) {
    // Handle void-specific errors
  }
}
```

## Examples

### Basic Example

```typescript
import { createVoid } from '@void/core';

async function main() {
  const app = createVoid();
  await app.initialize();
  await app.run();
  
  console.log('Successfully did nothing!');
}

main();
```

### With Options

```typescript
import { createVoid } from '@void/core';

const app = createVoid({
  mode: 'production',
  debug: true,
  plugins: []
});

await app.initialize();
console.log(app.getStatus()); // 'ready'
```

## License

MIT © The Void Team
