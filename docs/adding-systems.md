# Adding a new System

To add a new System to RPGKeeper, the first thing you have to do is to add a system definition. This is a typescript 
file that just provides a small object that describes the system it's identifier, and the name of the system. This is 
used to identify the system in the database and in the UI.

The system definition file should be placed in the `src/server/resource-access/systems` directory. The file should be
named with the system identifier, and should export a single object that adheres to the `SystemDefinition` interface.

Here is an example of a system definition file:

```typescript
import { SupportStatus, SystemDefinition } from '../../../common/models/system.js';

export default {
    id: 'dnd5e',
    name: 'Dungeons & Dragons 5e',
    description: 'The fifth edition of the Dungeons & Dragons role-playing game.',
    supportStatus: SupportStatus.Alpha,
    defaults: {
        // ... default values for the system, for now, leave blank.
    }
} satisfies SystemDefinition;
```

A few notes: First, you will want to set the `supportStatus` to `SupportStatus.Alpha` until the system is fully 
implemented with some marginal testing. Once it seems to be working well, you can change it to `SupportStatus.Beta`. 
(It will only move to `SupportStatus.Stable` once it has been used in production for a while and the project 
maintainers decide to change the support status.)

_Note: You may notice that there's a status for 'disabled'. These are systems that either had to be removed or are 
so broken / unimplemented that they're closer to a placeholder than something functional. By default, the only people 
who can see these are core developers who've enabled disabled systems in their user settings. Normal users can't 
even see or use them._

Second, the `defaults` property is a placeholder for any default values that the system might need when making a new 
character. For now, you can leave this blank, but you will need to fill it in later, once you've built a data model.

Once you have created the system definition file, you will need to add it to the return values of the `list` function in
`src/server/resource-access/system.ts`. This will allow the system to be loaded by the server and used in the UI.

Now, restart the server, and you should see your new system in the system dropdown in the UI. You can select it, but it
won't do anything yet, because you haven't implemented any of the system-specific functionality.

## Data Modeling

The next step is to create a data model for the system. This is a set of typescript interfaces that describe the data
that the system will use. These should be placed in the `src/common/models/systems` directory. The file should be named
with the system identifier, and may export as many interfaces as you need to describe the data model. We highly 
recommend that you export at least one interface that describes a character for the system, ending with 
`SystemDetails`. (ex: `Dnd5eSystemDetails`, `Pf2eSystemDetails`, etc.)

### Data Modeling Theory

When modeling data, you should consider the following:

- **What data is required to create a character?** This is the minimum amount of data that a user should have to enter
  to create a character. This should be the most common data that a user will need to enter.
- **What data is optional?** This is data that a user might want to enter, but isn't required. This could be things like
  a character's backstory, or a list of items that the character has.
- **What data is derived?** This is data that can be calculated from other data. For example, a character's hit points
  might be calculated from their level and constitution score. This data should not be stored in the database, but 
  should be calculated when needed.
- **What data is shared?** This is data that is shared between multiple characters. For example, a list of spells that
  are available to all characters in a system. This data should be stored in a separate table, and linked to the
  character data.

Data modeling is both the hardest and most important part of adding a new system. It's important to get this right, as
the longer you wait to fix it, the more data you will have to migrate. Additionally, the data model is the foundation
for all the other system-specific functionality, so if you get this wrong, you will have to fix it before you can
implement anything else.

A good place to start is with the character sheet. By emulating what's on there, you at least have something that's 
as functional as the original sheet. From there, you can add more features and functionality as needed.

### Data Modeling in Practice

You can take a look at the existing data models for examples of how to model data. Systems like `Risus` and `Fate` are
good examples of simple systems, while systems like `Edge of the Empire` and `Call of Cthulhu` are good examples of more
complex systems.

At the end of the day, where the rubber meets the road is in writing Typescript interfaces. Here's an example of a
simple data model for a D&D 5e character:

```typescript
import { BoundedRange } from '../../utils/types.js';

export interface Dnd5eSystemDetails
{
    // Basic Info
    name: string;
    class: string;
    level: number;
    background: string;
    abilityScores: {
        strength: BoundedRange<1, 30>;
        dexterity: BoundedRange<1, 30>;
        constitution: BoundedRange<1, 30>;
        intelligence: BoundedRange<1, 30>;
        wisdom: BoundedRange<1, 30>;
        charisma: BoundedRange<1, 30>;
    };
    // ... etc.
}
```

This is a simple data model that describes a D&D 5e character. It includes the character's name, class, level, 
background, and ability scores. You would, obviously, need to add more fields to fully describe a character, but this
should give you a good starting point.

Now, already you can see that there are some issues with this data model. For example, `class` is simply a string. 
Not only is this not very descriptive, but it also doesn't allow for any validation. You could enter anything you want
in there, and the system would accept it. Additionally, there's no way to multi-class. A better way to model this
would be to have a separate interface for classes, and then have an array of classes on the character. This would
allow for better validation and would allow for multi-classing.

Here is an updated version of the data model that includes a separate interface for classes:

```typescript
import { BoundedRange } from '../../utils/types.js';

export interface Dnd5eClass
{
    name: string;
    level: number;
}

export interface Dnd5eSystemDetails
{
    // Basic Info
    name: string;
    classes: Dnd5eClass[];
    level: number;
    background: string;
    abilityScores: {
        strength: BoundedRange<1, 30>;
        dexterity: BoundedRange<1, 30>;
        constitution: BoundedRange<1, 30>;
        intelligence: BoundedRange<1, 30>;
        wisdom: BoundedRange<1, 30>;
        charisma: BoundedRange<1, 30>;
    };
    // ... etc.
}

export interface Dnd5eClass
{
    name: string;
    level: number;
}
```

This is a better data model because it allows for better validation and allows for multi-classing. There's still a 
problem with it, and it's a common one. A character's class is not just a name and level, it's a reference to some 
sort of class definition. This is a common problem in data modeling, and it's called the "entity vs. value" problem.

In this case, `Dnd5eClass` is a value. It's just a name and a level. But what we really want is an entity. We want a
reference to a class definition. This is a common problem in data modeling, and it's something that you will have to
deal with when modeling data.

Here is an updated version of the data model that includes a reference to a class definition:

```typescript
import { BoundedRange } from '../../utils/types.js';

export interface Dnd5eClass
{
    name: string;
    description: string;
    hitDie: number;
    // ... etc.
}

export interface Dnd5eClassLevel
{
    name: string; // Must match a class name
    level: number;
}

export interface Dnd5eSystemDetails
{
    // Basic Info
    name: string;
    classes: Dnd5eClassLevel[];
    level: number;
    background: string;
    abilityScores: {
        strength: BoundedRange<1, 30>;
        dexterity: BoundedRange<1, 30>;
        constitution: BoundedRange<1, 30>;
        intelligence: BoundedRange<1, 30>;
        wisdom: BoundedRange<1, 30>;
        charisma: BoundedRange<1, 30>;
    };
    // ... etc.
}

```

This is a better data model because it allows for better validation and allows for multi-classing. It also allows for
better data modeling, as you can now store the class definition in a separate table, and reference it from the character
data. In RPGKeeper, this is done using the `Supplement` interface, which allows you to store data that is shared between
multiple characters, as well as provide a reference to where the data comes from.

#### Using Supplements

Supplements are an interface designed to make it easy to store, look up and retrieve data that is shared between 
characters. They are used to store things like class definitions, spell lists, and other data. Here is the interface
for a supplement:

```typescript
export interface Supplement
{
    id ?: number | string;
    name : string;
    owner ?: string;
    scope : 'user' | 'public';
    reference : string;
    official : boolean;
}
```

As you can see, it introduces the concept of ownership as well as 'scope'. This is used to determine who can see the
data. If the scope is 'user', then only the user who created the data can see it. If the scope is 'public', then anyone
can see it. This is useful for things like homebrew content, where you might want to keep it available to just you, 
versus official content, which is shared with everyone.

Part of the reason for this is handling copyright. If you're using official content, you have to make sure that you are
allowed to use it. Most TTRPGs have some sort of license that allows you to use their content, but you have to make sure
that you're following the rules. If you're using homebrew content, then you can do whatever you want with it, 
generally, but it's often less well tested or curated and some players don't like homebrew content.

The Supplement interface also includes a reference to where the data comes from. This is useful for tracking where the
data comes from, and for making sure that you're following the rules. If you're using official content, then you should
reference which page and book it comes from, like `"PHB:123"`, which would reference page 123 of the Player's Handbook.

Anyway, here is an example of how to use supplements to store class data:

```typescript
import { Supplement } from './supplements.js';
import { BoundedRange } from '../../utils/types.js';

export interface Dnd5eClass extends Supplement
{
    name: string;
    description: string;
    hitDie: number;
    // ... etc.
}

export interface Dnd5eClassLevel
{
    name: string; // Must match a class name
    level: number;
}

export interface Dnd5eSystemDetails
{
    // Basic Info
    name: string;
    classes: Dnd5eClassLevel[];
    level: number;
    background: string;
    abilityScores: {
        strength: BoundedRange<1, 30>;
        dexterity: BoundedRange<1, 30>;
        constitution: BoundedRange<1, 30>;
        intelligence: BoundedRange<1, 30>;
        wisdom: BoundedRange<1, 30>;
        charisma: BoundedRange<1, 30>;
    };
    // ... etc.
}
```

This data model will still need a lot of work before it's complete, but this should give you an idea of the level of 
detail required for data modeling. So far, this is the step that most people stop at when building a system. It's a lot
of work, and it's not very rewarding. But it's also the most important step, as it's the foundation for everything else.

## Database Tables

Once you have a data model, you will need to create database tables to store the data. This is done using Knex.js, which
is a SQL query builder for Node.js. You can find more information about Knex.js in the [Knex.js documentation][knex].

We make heavy use of their migrations and seeds functionality to manage the database schema. Migrations are used to
create and modify database tables, while seeds are used to populate the database with initial data.

<!-- Links -->

[knex]: https://knexjs.org/
