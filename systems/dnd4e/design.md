# Dungeons and Dragons 4th Edition

This is the design document for the `dnd4e` system. I've written this system about four times, now, here's hoping I'll 
get it right this time around.

## Data

The key to getting `dnd4e` right is figuring out how to store the data in a database correctly. If I can correctly store
characters, the UI can be tweaked or molded as needed.

### DnD4eCharacter Model

The basic overview of the model is this:

```javascript
var DnD4eCharacter = trivialModels.define({
    baseChar: types.String({ pk: true }),
    
    // Basic Biographic info
    class: types.String(),
    race: types.String(),
    size: types.Enum({ values: ['T', 'S', 'M', 'L', 'H', 'G'] }),
    level: type.Number({ integer: true }),
    gender: types.Enum({ values: ['M', 'F', 'O'] }),
    alignment: types.Enum({ values: ['LG', 'G', 'U', 'E', 'CE'] }),
    speed: type.Number({ integer: true }),
    languages: types.Array({ default: [] }),
    paragonPath: types.String(),
    epicDestiny: types.String(),
    
    // Abilities
    strength: type.Number({ integer: true }),
    constitution: type.Number({ integer: true }),
    dexterity: type.Number({ integer: true }),
    intelligence: type.Number({ integer: true }),
    wisdom: type.Number({ integer: true }),
    charisma: type.Number({ integer: true }),
    
    // Defenses
    acAbility: types.String({ default: 'strength' }),
    
    // Health
    hp: types.Object(),
    surges: types.Object(),
    
    // Additional Character details
    experience: types.Number({ integer: true }),
    wealth: types.Number(),
    skills: types.Array({ default: [] }),
    powers: types.Array({ default: [] }),
    feats: types.Array({ default: [] }),
    bonuses: types.Array({ default: [] }),
    equipment: types.Array({ default: [] }),
    pools: types.Array({ default: [] }),
    
    // Misc
    rolls: types.Array({ default: [] }),
    notes: types.Array({ default: [] }),
    conditions: types.Array({ default: [] }),
});
```

This data model should allow for things like custom skills, equipment, a rich bonus system, various pools 
(action points, power points, etc), and yet not be so free form as to be impossible to use. Several of the pieces of 
this model have their own design and schemas; they can be found in the sections below.

#### Languages

This is an array of objects, with the language name and the name of the script used to write it (_pg 25, PHb1_). The 
schema is very simple:

```javascript
var Language = trivialModels.define({
    language: types.String({ required: true }),
    script: types.String()
});
```

If a `script` property is not there, the `language` property should be used instead.

#### Defenses

Defenses in `dnd4e` are the result of pure calculation. Fortitude, Reflex, and Will can be entirely handled by the bonus
system (See 'Bonuses', below). AC, however, has one additional piece of information we need to know: what ability mod do
you add? To store this, we use the `acAbility` property.

The calculation for defenses (in psuedo code) should be:

```javascript
var ac = 10 + Math.floor(level / 2) + abilities[acAbility].mod + bonuses.getSum('ac');
var fortitude = 10 + Math.floor(level / 2) + bonuses.getSum('fortitude');
var reflex = 10 + Math.floor(level / 2) + bonuses.getSum('reflex');
var will = 10 + Math.floor(level / 2) + bonuses.getSum('will');
```

#### HP

Hit points have a maximum, a current value, and temporary HP:

```javascript
var HP = trivialModels.define({
    max: types.Number({ integer: true }),
    current: types.Number({ integer: true }),
    temp: types.Number({ integer: true })
});
```

From this we can calculate our Bloodied and Surge Value:

```javascript
var bloodied = Math.floor(hp.max / 2);
var surgeValue = Math.floor(hp.max / 4);
```

_Note: The `dnd4e` rules don't actually handle the case of hp.max being less than 4 (which would give a Surge Value of 0.
While technically, this is broken and the coded could be modified with a `|| 1` added to the calculation; I feel that if
the game designers didn't consider it, then the only reason you're ever encounter it is if you enter something 
incorrectly. The code won't blow up on 0, so I feel no strong urge to fix this._

#### Surges

Surges have a limited number per day, a current value.

```javascript
var Surges = trivialModels.define({
    perDay: types.Number({ integer: true }),
    current: types.Number({ integer: true }),
    secondWindAvailable: type.Boolean({ default: true })
});
```

The `secondWindAvailable` property indicates wether or not a second wind is _available_.

#### Wealth

This represents the amount of gold you have. I don't want to dick around with doing type conversions.

#### Skills

There is a default list of skills in `dnd4e`, however some campaigns may add skills. Because of this, it's much more
efficient to simply store a list of changes to the default skills, rather than a complete list of the skills. Each skill
has the following schema:

```javascript
var Skill = trivialModels.define({
    name: types.String({ required: true }),
    armorPenalty: types.Number({ integer: true }),
    trained: type.Boolean({ default: true }),
    removed: type.Boolean({ default: false })
});
```

As per everything else, bonuses are handled via the Bonus system, and all we store is a list of any skills that have
been modified. We rely on the UI to know what the default list of skills are, and to match our list up.

Special note: we support a `removed` property to indicate the user removed once of the default skills. (This should only
be used for default skills.)

#### Powers

...


#### Feats

...

#### Bonuses

...

#### Equipment

...

#### Pools

...

#### Rolls

...

#### Notes

...

#### Conditions

...
