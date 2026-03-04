# Contributing to Void

First off, thank you for considering contributing to Void! It's people like you that make Void such a great framework.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples**
* **Describe the behavior you observed**
* **Explain which behavior you expected to see instead**
* **Include screenshots if relevant**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **A clear and descriptive title**
* **A detailed description of the proposed functionality**
* **Explain why this enhancement would be useful**
* **List any examples of similar features in other projects**

### Pull Requests

* Fill in the required template
* Follow the TypeScript styleguide
* Include tests for any new functionality
* Update documentation as needed
* End all files with a newline
* Ensure the test suite passes
* Make sure your code lints

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/void.git
cd void

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run linter
pnpm lint
```

## Project Structure

```
void/
├── packages/           # All framework packages
│   ├── core/          # Core framework
│   ├── cli/           # CLI tool
│   ├── utils/         # Utilities
│   └── ...            # Other packages
├── examples/          # Example projects
├── docs/              # Documentation
└── scripts/           # Build and maintenance scripts
```

## Coding Style

* Use TypeScript for all code
* Follow functional programming principles where possible
* Write meaningful variable and function names
* Comment complex logic
* Keep functions small and focused
* Use async/await over promises where possible

## Testing

* Write tests for all new features
* Maintain 100% code coverage
* Use descriptive test names
* Group related tests using describe blocks

```typescript
describe('createVoid', () => {
  it('should create a Void instance', () => {
    const app = createVoid();
    expect(app).toBeDefined();
  });
});
```

## Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests after the first line

## Package Development

When creating a new package:

1. Create a new directory in `packages/`
2. Copy the structure from an existing package
3. Update the README with package-specific documentation
4. Add tests with good coverage
5. Export all public APIs from index.ts
6. Update root README to include the new package

## Documentation

* Update README.md if you change public APIs
* Add JSDoc comments to all public functions
* Include code examples in documentation
* Keep language simple and clear

## Questions?

Feel free to open an issue with the "question" label!

---

Thank you for contributing to making nothing better! 🎉
