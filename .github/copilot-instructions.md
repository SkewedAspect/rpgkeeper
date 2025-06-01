# GitHub Copilot Instructions for Tome MCP Server

## Software Architecture Overview

We decompose *only* by future volatility, never by today’s features.  
One axis of volatility ➜ one service boundary. This is called 'The Method'.

All code lives in exactly one of five **canonical roles**:  
* **Client** – UI/API façade; zero business logic.  
* **Manager** – Orchestrates a workflow; minimal state.  
* **Engine** – Pure, stateless business rules; never calls Managers.  
* **ResourceAccess** – Isolates data stores/external systems; no business logic.  
* **Utility** – Cross-cutting, domain-agnostic helpers that could run on a toaster.

Role etiquette:  
* Managers call Engines and ResourceAccess.  
* Engines may call ResourceAccess but never Managers or Clients.  
* Services communicate via interfaces or async messaging—**never** shared DB tables.

Coding rules:  
* Keep business logic inside Engines; nowhere else.  
* Use dependency injection, immutable inputs, and idempotent operations.  
* Add unit tests per role; mock collaborators.  
* When suggesting new code, pick the folder that matches the role (`/Client`, `/Manager`, etc.) and include interface stubs first.

If uncertain, choose the design that confines future change to a single service and ask for confirmation.

## Technology Stack

- **Language**: TypeScript
- **Framework**: Server: Node.js, Client: Vue 3 (Composition API)
- **Testing**: Mocha, Chai, Sinon
- **Linting**: ESLint with TypeScript support
- **Formatting**: ESLint
- **Package Management**: npm
- **Build Tool**: Vite, TypeScript compiler (tsc)
- **Version Control**: Git
- **Documentation**: JSDoc for inline documentation

## Code Style and Conventions

This project follows the coding conventions. Please adhere to the following style guidelines:

### General Formatting
- **Indentation**: 4 spaces (no tabs)
- **Max Line Length**: 120 characters
- **Brace Style**: Allman style (opening braces on new line)
- **Quotes**: Single quotes preferred over double quotes
- **Semicolons**: Always required

### TypeScript Specific
- **Type Annotations**: Spaces before and after colons `param : Type`
- **Function Return Types**: Always explicit `function name() : ReturnType`
- **Array Spacing**: `[ item, item ]` (spaces inside brackets)
- **Object Spacing**: `{ key: value }` (spaces inside braces)
- **Template Literals**: `${ variable }` (spaces inside template expressions)
- **Imports**: Use `.ts` extension for TypeScript files, e.g. `import { MyClass } from './my-class.ts';`
- **Type Imports**: Use `import type` for type-only imports like interfaces.

### Comments and Documentation
- Use decorative comment blocks with dashes that fill out to 120 characters wide for file headers and major sections, like this:

```typescript
//----------------------------------------------------------------------------------------------------------------------
// Section Description
//----------------------------------------------------------------------------------------------------------------------
```

- Do not exceed 120 characters in comment lines
- End files with a decorative comment footer
- Use single-line comments `//` for inline documentation

### Function and Variable Naming

- **Functions**: camelCase with descriptive names
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE for module-level constants
- **Classes**: PascalCase
- **Interfaces**: PascalCase, no "I" prefix

### Code Organization
- **Function Style**: Prefer function declarations over arrow functions for top-level functions
- **Imports**: Sort imports alphabetically, group by type (external, internal)
- **No unused variables**: Use underscore prefix `_variable` for intentionally unused parameters

### Error Handling
- Use explicit error types when possible
- Prefer returning error objects over throwing exceptions in core logic
- Use async/await over Promises for readability

### Testing
- Follow the same style conventions in test files
- Use descriptive test names that explain the behavior being tested
