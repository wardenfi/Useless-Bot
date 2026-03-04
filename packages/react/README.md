# @void/react

React hooks and components for the Void framework. Render nothing, reactively.

## Installation

```bash
npm install @void/react react
```

## Hooks

### `useVoid()`

Creates a void instance in your component.

```typescript
import { useVoid } from '@void/react';

function MyComponent() {
  const void = useVoid({
    mode: 'production'
  });

  return <div>Rendering nothing!</div>;
}
```

### `useNothing()`

A hook that returns nothing. Always.

```typescript
import { useNothing } from '@void/react';

function MyComponent() {
  const nothing = useNothing(); // undefined
  
  return null; // Render nothing
}
```

### `useVoidEffect(callback)`

Like `useEffect`, but does nothing.

```typescript
import { useVoidEffect } from '@void/react';

function MyComponent() {
  useVoidEffect(() => {
    // This runs, but accomplishes nothing
  });

  return null;
}
```

### `useVoidState()`

State management for nothing.

```typescript
import { useVoidState } from '@void/react';

function MyComponent() {
  const [value, setValue] = useVoidState(); 
  // value is always undefined, setValue does nothing

  return <button onClick={() => setValue(undefined)}>Do Nothing</button>;
}
```

### `useVoidCallback(callback)`

Memoizes a callback that does nothing.

```typescript
import { useVoidCallback } from '@void/react';

function MyComponent() {
  const handleClick = useVoidCallback(() => {
    // Do nothing, but memoized!
  });

  return <button onClick={handleClick}>Click me</button>;
}
```

### `useVoidMemo(factory)`

Memoizes nothing.

```typescript
import { useVoidMemo } from '@void/react';

function MyComponent() {
  const nothing = useVoidMemo(() => undefined);
  
  return null;
}
```

## Components

### `<VoidProvider>`

Provides void context to your app.

```typescript
import { VoidProvider } from '@void/react';

function App() {
  return (
    <VoidProvider config={{ mode: 'production' }}>
      <YourApp />
    </VoidProvider>
  );
}
```

### `<Void>`

A component that renders nothing.

```typescript
import { Void } from '@void/react';

function MyComponent() {
  return (
    <>
      <h1>Hello</h1>
      <Void /> {/* Renders nothing */}
      <p>World</p>
    </>
  );
}
```

### `<Nothing>`

Alias for `<Void>`, also renders nothing.

```typescript
import { Nothing } from '@void/react';

function MyComponent() {
  return <Nothing />;
}
```

## Context

### `useVoidContext()`

Access the void context from any component.

```typescript
import { useVoidContext } from '@void/react';

function MyComponent() {
  const { instance, config } = useVoidContext();
  
  return <div>Using void context</div>;
}
```

## Higher-Order Components

### `withVoid(Component)`

Wraps a component with void capabilities.

```typescript
import { withVoid } from '@void/react';

function MyComponent({ void }) {
  // Use void instance
  return <div>Nothing here</div>;
}

export default withVoid(MyComponent);
```

## Examples

### Complete Example

```typescript
import { VoidProvider, useVoid, Void } from '@void/react';

function VoidApp() {
  const void = useVoid({ debug: true });
  
  React.useEffect(() => {
    void.initialize();
  }, []);

  return (
    <div>
      <h1>My Void App</h1>
      <Void />
      <p>Successfully rendered nothing!</p>
    </div>
  );
}

function App() {
  return (
    <VoidProvider>
      <VoidApp />
    </VoidProvider>
  );
}
```

## TypeScript

Full TypeScript support included:

```typescript
import type { VoidHookOptions, VoidContextValue } from '@void/react';

const options: VoidHookOptions = {
  mode: 'production',
  debug: false
};
```

## License

MIT © The Void Team
