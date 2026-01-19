# Genesys Data Import Tool

Imports Genesys sourcebook data from the [SilentArctic GitHub repository](https://github.com/SilentArctic/silentarctic.github.io) and converts it to RPGKeeper's YAML format.

## Setup

```bash
# Navigate to the tool directory
cd packages/systems/src/eote/tools/genesys-import

# Install dependencies
npm install
```

## Usage

```bash
# From the genesys-import directory:

# Full import (all types, all books)
npm start

# Dry run (show what would be written without writing)
npm run import:dry-run

# Import with options
npm start -- --type=talent
npm start -- --book=CRB
npm start -- --dry-run --type=weapon
```

Alternatively, from the project root:

```bash
npx tsx packages/systems/src/eote/tools/genesys-import/index.ts [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Show what would be written without writing files |
| `--type=TYPE` | Only import specific type: `talent`, `quality`, `weapon`, `attachment`, `ability` |
| `--book=ABBR` | Only import from specific book (see book abbreviations below) |

## Supported Data Types

| External Type | Internal Type | Notes |
|---------------|---------------|-------|
| `talent` | talent | Direct mapping with activation type conversion |
| `quality` | quality | Ranked detection from description text |
| `gear` (type="weapon") | weapon | Filtered from gear array, maps skills and qualities |
| `gear` (type="attachment") | attachment | Parses useWith and modifiers from description |
| `adversaryAbility` / `archetypeAbility` | ability | Combined into single ability type |

## Supported Books

| Abbreviation | Full Name | JSON File |
|--------------|-----------|-----------|
| G-CRB | Genesys Core Rulebook | `core-rule-book.json` |
| G-EPG | Expanded Player's Guide | `expanded-players-guide.json` |
| RoT | Realms of Terrinoth | `realms-of-terrinoth.json` |
| SotB | Shadow of the Beanstalk | `shadow-of-the-beanstalk.json` |
| SotC | Secrets of the Crucible | `secrets-of-the-crucible.json` |
| EotI | Embers of the Imperium | `embers-of-the-imperium.json` |

## Data Transformations

### Description Conversion

External descriptions use a `varyingDisplay` format (array of content blocks). These are converted to plain text with XML dice tags:

```
External: "Add {@dice boost|2} to the check"
Internal: "Add <boost></boost><boost></boost> to the check"
```

Symbol characters (`{@symbols aaa}`) are converted to repeated dice tags:
- `a` = `<advantage></advantage>`
- `s` = `<success></success>`
- `t` = `<threat></threat>`
- etc.

### Activation Type Mapping (Talents)

| External | Internal |
|----------|----------|
| `passive` | `p` |
| `active (incidental)` | `ai` |
| `active (incidental, out of turn)` | `aio` |
| `active (maneuver)` | `am` |
| `active (action)` | `aa` |

### Range Mapping (Weapons)

| External | Internal |
|----------|----------|
| `Engaged` | `en` |
| `Short` | `s` |
| `Medium` | `m` |
| `Long` | `l` |
| `Extreme` | `ex` |
| `Strategic` | `ex` |

### ID Generation

IDs are generated in the format: `genesys-{type}-{slug(name)}`

Example: "Quick Strike" becomes `genesys-talent-quick-strike`

## How It Works

1. **Fetch**: Clones the SilentArctic repository to a temp directory (or pulls if already cloned)
2. **Parse**: Reads all `api/*.json` book files
3. **Extract**: Extracts talents, qualities, gear, and abilities from each book
4. **Convert**: Transforms external format to internal YAML format
5. **Deduplicate**: Merges items by ID (same item may appear in multiple books)
6. **Write**: Overwrites YAML files in `static/genesys/definitions/`

## Output Directories

Files are written to:
- `packages/systems/src/eote/static/genesys/definitions/talents/`
- `packages/systems/src/eote/static/genesys/definitions/qualities/`
- `packages/systems/src/eote/static/genesys/definitions/weapons/`
- `packages/systems/src/eote/static/genesys/definitions/attachments/`
- `packages/systems/src/eote/static/genesys/definitions/abilities/`

## File Structure

```
genesys-import/
├── index.ts              # Main CLI entry point
├── fetcher.ts            # Repository cloning and JSON loading
├── types.ts              # External schema TypeScript types
├── utils.ts              # Slugify, mapping utilities
├── converters/
│   ├── index.ts          # Re-exports
│   ├── description.ts    # varyingDisplay conversion
│   ├── talent.ts         # Talent converter
│   ├── quality.ts        # Quality converter
│   ├── weapon.ts         # Weapon converter
│   ├── attachment.ts     # Attachment converter
│   └── ability.ts        # Ability converter
└── README.md             # This file
```

## Dependencies

- `simple-git` - For cloning the source repository
- `yaml` - For writing YAML files (already in project)
