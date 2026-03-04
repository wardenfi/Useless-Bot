# @void/cli

Command-line interface for the Void framework. Build nothing from the comfort of your terminal.

## Installation

```bash
npm install -g @void/cli
# or
yarn global add @void/cli
# or
pnpm add -g @void/cli
```

## Commands

### `void init`

Initialize a new Void project in the current directory.

```bash
void init
void init --name my-project
void init --typescript
```

### `void dev`

Start the development server (which does nothing, but in watch mode).

```bash
void dev
void dev --port 3000
void dev --verbose
```

### `void build`

Build your project for production.

```bash
void build
void build --minify
void build --output dist
```

### `void test`

Run your test suite.

```bash
void test
void test --watch
void test --coverage
```

### `void lint`

Lint your codebase.

```bash
void lint
void lint --fix
```

### `void deploy`

Deploy your application (to the void).

```bash
void deploy
void deploy --environment production
void deploy --dry-run
```

### `void --version`

Display the current version.

```bash
void --version
```

### `void --help`

Display help information.

```bash
void --help
void init --help
```

## Configuration

Create a `void.config.js` file in your project root:

```javascript
export default {
  mode: 'production',
  plugins: [],
  output: 'dist',
};
```

## Examples

```bash
# Create a new project
mkdir my-void-project
cd my-void-project
void init

# Start development
void dev

# Build for production
void build

# Deploy
void deploy
```

## License

MIT © The Void Team
