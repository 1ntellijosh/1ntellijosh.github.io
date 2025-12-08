# TypeScript Migration Guide

This document outlines the steps to convert this JavaScript project to TypeScript.

## Overview

The project will be restructured as follows:
- **Source files**: Move from `js/` to `src/` directory (TypeScript `.ts` files)
- **Compiled output**: TypeScript will compile to `js/` directory (JavaScript files)
- **Build process**: Use `npm run build` to compile TypeScript to JavaScript

## Step-by-Step Migration Process

### Step 1: Install Dependencies ✅

```bash
npm install
```

This installs:
- TypeScript compiler (`typescript`)
- jQuery type definitions (`@types/jquery`)

### Step 2: Create Source Directory Structure

1. Create a `src/` directory
2. Copy the entire `js/` directory structure to `src/`
3. Rename all `.js` files to `.ts`

```bash
mkdir -p src
cp -r js/* src/
find src -name "*.js" -exec sh -c 'mv "$1" "${1%.js}.ts"' _ {} \;
```

### Step 3: Update Import Statements

In TypeScript files, you can remove the `.js` extension from imports (TypeScript handles this):

**Before:**
```typescript
import Game from './Game.js';
```

**After:**
```typescript
import Game from './Game';
```

However, if you want to keep the `.js` extensions (for compatibility), you can configure TypeScript to allow this.

### Step 4: Add Type Definitions

#### 4.1 Create Type Definitions for Enums

Convert `EntityTypeEnums.js` to use TypeScript enums or const assertions:

```typescript
export const EntityTypeEnums = {
  SHIP: 'ship',
  MISSILE: 's',
  // ... etc
} as const;

export type EntityType = typeof EntityTypeEnums[keyof typeof EntityTypeEnums];
```

#### 4.2 Create Interfaces for Complex Objects

Create interfaces for:
- Game state objects
- Sprite objects
- Configuration objects
- Event handlers

Example:
```typescript
interface GameKeys {
  lKey: boolean;
  rKey: boolean;
  uKey: boolean;
  dKey: boolean;
  sKey: boolean;
}

interface GameSounds {
  death: HTMLAudioElement;
  tap: HTMLAudioElement;
  blowUp: HTMLAudioElement;
  rez: HTMLAudioElement;
  boost: HTMLAudioElement;
  nova: HTMLAudioElement;
}
```

### Step 5: Add Type Annotations

Add types to:
- Function parameters
- Return types
- Class properties
- Variables

Example conversion:
```typescript
// Before (JavaScript)
canProcessMissileFire = function() {
  return this.clip > this.clipReady && this.mag <= this.clipSize
}

// After (TypeScript)
canProcessMissileFire = function(): boolean {
  return this.clip > this.clipReady && this.mag <= this.clipSize
}
```

### Step 6: Update HTML File

The HTML file should continue to reference the compiled JavaScript files in the `js/` directory:

```html
<script src="js/app.js" type="module" charset="utf-8"></script>
```

No changes needed here since TypeScript compiles to the same location.

### Step 7: Build and Test

1. Run the build:
   ```bash
   npm run build
   ```

2. Test the game in a browser to ensure everything works

3. For development with auto-rebuild:
   ```bash
   npm run watch
   ```

### Step 8: Update Build Process (Optional)

You can update the Makefile to include TypeScript compilation:

```makefile
build:
	npm run build

dev:
	npm run watch
```

## Key TypeScript Features to Use

1. **Interfaces**: Define contracts for objects
2. **Enums**: Use TypeScript enums or const assertions for constants
3. **Type annotations**: Add types to function parameters and returns
4. **Generics**: Use for factory patterns and reusable code
5. **Abstract classes**: Already using these - TypeScript supports them natively

## Common Conversion Patterns

### Class Properties
```typescript
// Before
class Game {
  constructor() {
    this.score = 0;
  }
}

// After
class Game {
  score: number = 0;
  
  constructor() {
    // initialization
  }
}
```

### Arrow Functions with Types
```typescript
// Before
drawBoard = function() {
  return this;
}

// After
drawBoard = (): Game => {
  return this;
}
```

### Event Handlers
```typescript
// Before
keyReader = function(event) {
  // ...
}

// After
keyReader = (event: KeyboardEvent): Game => {
  // ...
}
```

## Migration Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Create `src/` directory
- [ ] Copy and rename all `.js` files to `.ts` in `src/`
- [ ] Update import statements (remove `.js` extensions)
- [ ] Add type definitions for enums
- [ ] Create interfaces for complex objects
- [ ] Add type annotations to functions
- [ ] Add type annotations to class properties
- [ ] Fix TypeScript compilation errors
- [ ] Test the game in browser
- [ ] Update documentation

## Notes

- The `js/` directory will now contain compiled output (don't edit these files)
- Source files go in `src/` directory
- Run `npm run build` before committing changes
- Use `npm run watch` during development for auto-compilation

