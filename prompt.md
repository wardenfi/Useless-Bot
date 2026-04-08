# Vaporware Project Template Guide

This guide provides comprehensive instructions for creating variations of this satirical project. Use this as a reference for building similar projects with consistent styling, structure, and tone.

## Project Overview

This is a satirical vaporware project presented as a legitimate TypeScript monorepo with professional documentation and website. The humor derives from the contrast between elaborate professional presentation and the actual functionality (which does nothing).


### Color Palette

The site uses a **light minimalist aesthetic** inspired by wibandwob.com:

- **Background**: `#c7d5e0` (light blue-gray)
- **Text**: `#333` (dark gray)
- **Borders**: `#999` (medium gray)
- **Links**: `#666` (gray, underlined on hover)
- **Accent borders**: `#555` (darker gray for emphasis boxes)

### Typography

- **Font Family**: `'Courier New', monospace` (monospace for technical/hacker aesthetic)
- **Font Sizes**:
  - Body: `16px` / `1.6em`
  - Headings: `2em-3em` range
  - Taglines: `1.2em`
- **Line Height**: `1.6` for readability

### Spacing & Layout

- **Max Width**: `900px` centered container
- **Padding**: `40px` on main container, `20px` on sections
- **Margins**: `20px` between major sections, `10-15px` between paragraphs
- **Border Style**: `2px solid #999` simple lines, no shadows or gradients

## Website Structure

### File Organization

```
docs/
  ├── index.html      # Landing page
  ├── docs.html       # Full documentation
  ├── CNAME           # Custom domain (format: subdomain.domain.tld)
  ├── .nojekyll       # Prevent Jekyll processing
  └── README.md       # Documentation about the website
```

### index.html Structure

The landing page follows this pattern:

1. **Header Section**
   - ASCII art logo (key visual element)
   - Tagline describing the "framework"
   
2. **Navigation**
   - Simple text links separated by `/`
   - Links: about, docs, github
   
3. **Hero Section**
   - Primary description
   - Feature badges (presented as if they're real features)
   
4. **Info Box** (optional)
   - Bordered section with key information
   - Uses simple border styling
   
5. **Metrics/Stats Section** (optional)
   - Satirical statistics
   - Grid layout with borders
   
6. **Quick Start**
   - Code blocks showing installation
   - Usage examples
   
7. **Philosophy/About** (optional)
   - Explains the satirical concept
   
8. **CTA Buttons**
   - Links to documentation and GitHub
   - Styled as bordered buttons

9. **Footer**
   - Copyright, license info
   - Additional links

### docs.html Structure

Full documentation page with:

1. **Sidebar Navigation**
   - Fixed left sidebar with section links
   - Light background (`#d5dde5`)
   - All lowercase section titles
   
2. **Main Content Area**
   - Comprehensive "documentation"
   - Multiple sections covering every aspect
   - Code examples throughout
   
3. **Section Types**:
   - Introduction
   - Getting Started
   - Core Concepts
   - API Reference
   - Advanced Usage
   - Community/Support
   - FAQ

## ASCII Art Guidelines

### Design Principles

1. **Italicized/Slanted Style**: Use forward slashes and angles to create lean
2. **Clarity**: Prioritize readability - characters should be distinguishable
3. **Spacing**: Proper alignment and spacing between letters
4. **Size**: Large enough to be a header, but not overwhelming

### Example Pattern

```
                                __  __    __                
      _      ______  _____ __/ /_/ /_  / /__  __________
     | | /| / / __ \/ ___/ __/ __ \/ / / _ \/ ___/ ___/
     | |/ |/ / /_/ / /  / /_/ / / / / /  __(__  |__  ) 
     |__/|__/\____/_/   \__/_/ /_/_/_/\___/____/____/  
```

### Tools for Creation

- Use online ASCII art generators as starting points
- Manually adjust for:
  - Consistent slant/italic appearance
  - Letter spacing and alignment
  - Visual balance
  - Readability at typical screen sizes

## CSS Patterns

### Base Styles

```css
body {
    font-family: 'Courier New', monospace;
    background-color: #c7d5e0;
    color: #333;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    background-color: #c7d5e0;
    padding: 40px;
}
```

### Heading Styles

```css
h1, h2, h3 {
    margin-top: 30px;
    margin-bottom: 15px;
    text-transform: lowercase; /* CRITICAL */
}
```

### Link Styles

```css
a {
    color: #666;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
```

### Button Styles

```css
.btn {
    display: inline-block;
    padding: 12px 24px;
    border: 2px solid #999;
    background-color: transparent;
    color: #333;
    text-decoration: none;
    margin: 5px;
    transition: background-color 0.2s;
}

.btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
}
```

### Code Block Styles

```css
.code-block {
    background-color: rgba(0, 0, 0, 0.05);
    border: 1px solid #999;
    padding: 15px;
    font-family: 'Courier New', monospace;
    overflow-x: auto;
    margin: 15px 0;
}
```

### Box/Section Styles

```css
.info-box, .philosophy-box {
    border: 2px solid #555;
    padding: 25px;
    margin: 30px 0;
    background-color: rgba(255, 255, 255, 0.1);
}
```

## Monorepo Structure

### Root Files

- `package.json` - Workspace configuration with pnpm
- `pnpm-workspace.yaml` - Package workspace definitions
- `tsconfig.json` - Shared TypeScript config
- `vitest.config.ts` - Test configuration
- Standard docs: README, LICENSE, CODE_OF_CONDUCT, CONTRIBUTING, etc.

### Package Organization

```
packages/
  ├── core/          # Main functionality package
  ├── types/         # Type definitions
  ├── react/         # React integration
  ├── cli/           # Command-line tool
  ├── utils/         # Utility functions
  ├── logger/        # Logging utilities
  └── [others]/      # Additional packages as needed
```

### Package Template

Each package should have:

```
package-name/
  ├── package.json   # Package configuration
  ├── README.md      # Package-specific docs
  ├── tsup.config.ts # Build configuration (if needed)
  └── src/
      ├── index.ts   # Main entry point
      └── *.test.ts  # Tests (optional)
```

### Package.json Pattern

```json
{
  "name": "@namespace/package-name",
  "version": "0.0.1",
  "description": "Satirical description",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "test": "vitest"
  },
  "keywords": ["satirical", "keywords"],
  "author": "Team Name",
  "license": "MIT"
}
```

## Naming Conventions

### Project Names

- Use lowercase with creative spelling (zeros for o's, etc.)
- Examples: `n0thing`, `useless`, `m0g`
- GitHub org: `the[projectname]bot`
- Package namespace: `@projectname/*`

### Repository Structure

- Repo name: `projectname-bot`
- Domain: `projectname.fun` or similar
- Binary/CLI name: `projectname`

### Type/Interface Naming

Follow pattern of adding project name to standard types:
- `createProjectName()` function
- `ProjectNameInstance` interface
- `ProjectNameResult` type
- `ProjectNameError` class
- `useProjectName()` hook (React)
- `ProjectNameProvider` component (React)

## Content Guidelines

### Tone

- **Professional but absurd**: Use technical language for nothing
- **Comprehensive**: Over-document trivial or non-existent features
- **Self-aware**: Subtle hints that this is satire
- **Straight-faced**: Present everything as legitimate

### Documentation Sections to Include

1. **What it does** (nothing, in elaborate terms)
2. **Why use it** (satirical reasons)
3. **Installation** (real-looking but pointless)
4. **Usage examples** (code that does nothing)
5. **API reference** (functions that return void/null)
6. **Advanced features** (elaborate descriptions of nothing)
7. **Performance metrics** (impossible statistics)
8. **Roadmap** (ambitious plans for nothing)
9. **Contributing** (how to contribute nothing)
10. **Philosophy** (the meaning of nothing)

### Code Example Pattern

```typescript
// Show realistic TypeScript with proper syntax
import { createProjectName } from '@namespace/core';

const bot = createProjectName({
  // Realistic config options
  mode: 'autonomous',
  verbose: true
});

// Methods that clearly do nothing
const result = await bot.doNothing();
console.log(result); // null
```

## GitHub Pages Setup

### Domain Configuration

1. Create `docs/CNAME` file with your domain
2. Point domain DNS to GitHub Pages:
   - A records to GitHub IPs
   - Or CNAME to `username.github.io`
   
3. Enable GitHub Pages in repo settings:
   - Source: `main` branch
   - Folder: `/docs`

### Files Required

- `docs/.nojekyll` - Empty file, prevents Jekyll processing
- `docs/CNAME` - Single line with domain
- `docs/index.html` - Landing page
- `docs/docs.html` - Documentation page

## Build Configuration

### tsup.config.ts Pattern

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
```

### TypeScript Configuration

Use strict mode with modern settings:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

## Design Principles Summary

### Visual Identity

1. **Simplicity**: No gradients, shadows, or animations
2. **Clarity**: High contrast text, readable fonts
3. **Borders**: Simple solid lines for structure
4. **Lowercase**: All headings and navigation in lowercase
5. **Monospace**: Courier New for technical aesthetic
6. **ASCII Art**: Prominent slanted/italic logo

### Layout Principles

1. **Centered**: Max-width container, centered on page
2. **Generous spacing**: Don't cram content
3. **Clear hierarchy**: Distinct header, nav, content, footer
4. **Sidebar for docs**: Fixed navigation on documentation page
5. **Responsive**: Works at various screen sizes

### Content Structure

1. **Progressive disclosure**: Landing page teases, docs page elaborates
2. **Code-heavy**: Lots of examples even though they do nothing
3. **Professional format**: Tables, lists, organized sections
4. **Comprehensive**: Cover every aspect in detail

## Creating a New Variation

### Step-by-Step Process

1. **Choose concept**: What will this project "not do"?
2. **Create ASCII art**: Generate logo in italic/slanted style
3. **Set up structure**: Copy file structure, update names
4. **Update package namespace**: Find/replace `@oldname` with `@newname`
5. **Update types**: Rename interfaces/types consistently
6. **Write landing page**: Use index.html as template
7. **Write documentation**: Use docs.html as template
8. **Create packages**: Minimal implementation for each package
9. **Configure domain**: Set up CNAME and GitHub Pages
10. **Write documentation files**: README, CONTRIBUTING, etc.

### Find and Replace Checklist

When creating a variation, replace these systematically:

- Package namespace: `@oldname/*` → `@newname/*`
- Function names: `createOldName` → `createNewName`
- Type names: `OldNameInstance` → `NewNameInstance`
- CLI binary: `oldname` → `newname`
- Repository: `github.com/theoldbot/old-bot` → `github.com/thenewbot/new-bot`
- Domain references: `old.fun` → `new.fun`
- ASCII art: Replace with new project name
- Taglines and descriptions: Update to match new concept

## Technical Requirements

### Dependencies

Minimal, typically only:
- TypeScript 5.3+
- pnpm for workspace management
- tsup for building packages
- vitest for testing (optional)
- ESLint and Prettier for code style

### Browser Compatibility

The websites use pure HTML/CSS with no JavaScript, so compatibility is universal. Use standard HTML5 and CSS3 features.

### Performance

- Static HTML = instant load
- No external dependencies except fonts (Courier New is system font)
- No images except ASCII art (which is text)
- No build process for website files

## Maintenance Notes

### Consistency is Key

- Maintain color palette across all pages
- Use consistent spacing/padding values
- Keep tone consistent throughout

### Common Pitfalls to Avoid

1. ❌ Don't add unnecessary complexity (gradients, animations, JS)
2. ❌ Don't capitalize headings (breaks aesthetic)
3. ❌ Don't use system fonts other than monospace
4. ❌ Don't add real functionality (defeats the purpose)
5. ❌ Don't make ASCII art too complex (readability suffers)

### Quality Checklist

Before finalizing:

- [ ] ASCII art is readable and slanted/italic
- [ ] All headings are lowercase
- [ ] Color palette is consistent
- [ ] Package names follow namespace pattern
- [ ] GitHub repo name matches pattern
- [ ] CNAME is configured
- [ ] All links work (relative paths correct)
- [ ] Code examples are syntactically valid
- [ ] Documentation is comprehensive
- [ ] Tone is consistent throughout
- [ ] Mobile/responsive layout works
- [ ] No console errors or warnings

---

## Example Implementation: "mog bot"

For reference, here's how you might start "mog bot":

### Names and Identifiers
- Package namespace: `@mog/*`
- GitHub org: `themogbot`
- Repository: `mog-bot`
- Domain: `mog.fun` or `mog.bot`
- CLI binary: `mog`

### Core Types
- `createMog()` - Main factory function
- `MogInstance` - Instance interface
- `MogResult`, `MogError`, `MogCallback`, etc.
- `useMog()`, `MogProvider` (React)

### ASCII Art Direction
Create "mog bot" in slanted/italic style similar to "useless bot" example

### Content Theme
Maintain satirical tone about whatever "mog" does (or doesn't do)

---

This template provides all the structural and stylistic patterns needed to create consistent variations while allowing creative freedom with the specific content and concept.