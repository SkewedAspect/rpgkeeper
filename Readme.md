# RPGKeeper

I am an avid table-top RPG player. I have been playing various forms of RPGs for years (currently it's mainly D&D, and 
Edge of the Empire). Frequently, I felt limited or frustrated by the paper character sheets I had. And sometimes I'd
lose them, or something would get spilled, or I'd want to look up something about my character, but didn't have it on me.
Any of you who've played table-top RPGs know what I'm talking about.

That's why I've decided to make a website for storing your characters. It's a daunting task, and I've been working on
various versions of it for years; this is only the latest iteration. And yes, it does keep getting better.

My vision for RPGKeeper is that it become a site useful for groups of players as well as individuals. I want GMs and 
Players to love it, using it for big campaigns, and as a central clearinghouse for campaign related things. At the 
moment, most of these features are missing, but I will be working on adding them just as soon as I get my core target 
systems built and working.

## Development

Before getting started you will need the following installed:

* NodeJS >= 10 (v12+ recommended)
* Yarn package manager (`npm install -g yarn`)

### Running

The first thing you will want to do is to install dependencies:  

* `yarn`

Next, build the client assets:

* `yarn build:watch` (for development)
* `yarn build:release` (for release)

_Note: In a future version this will also build the server._

Finally, you will need to start the server:

* `yarn start`

It should create a new database file: `<project_root>/db/rpgk.db`. You should now be able to access the running client
at http://localhost:5678/.

## Targets Systems

The systems I'm initially building/supporting:

* Generic System
    * This should be suitable for any system that doesn't use special dice. (Or, any system, if you don't mind rolling physical dice.)
* Risus
    * Should be simple, and is great for one-shots.
* FATE
    * This is a middle-weight system, and has seen some uptake lately, there's no reason not to consider it.
* Edge of the Empire
    * I run a lot of EotE content, and the system is simple enough it wasn't that hard.
* Genesys
    * It's just a more generic EotE; likely EotE can be implemented as a variant of this system.
* Dungeons and Dragons 3.5 Edition
    * Another nostalgic system that still has quite a following.
* Dungeons and Dragons 4th Edition
    * I still run/play in several of these campaigns, so I plan on supporting this for a while to come.
* Dungeons and Dragons 5th Edition
    * While I'm not a fan, I know it's the next version of D&D, and I'd like to support it.
* Vampire the Masquerade
    * This is nostalgic for me, and I have a lot of old characters I'd like to digitize.

## Current Progress

* [ ] Campaign Support
    * [ ] Initial Design
* [ ] Systems
    * [ ] Generic System
        * [ ] Data model
        * [ ] UI
    * [X] Risus
        * [X] Data model
        * [X] UI
    * [X] FATE
        * [X] Data model
        * [X] UI
    * [ ] Genesys / EotE
        * [ ] Data Model
        * [ ] UI
    * [ ] Dungeons and Dragons 3.5
        * [ ] Data model
        * [ ] UI
    * [ ] Dungeons and Dragons 4
        * [ ] Data model
        * [ ] UI
    * [ ] Dungeons and Dragons 5
        * [ ] Data model
        * [ ] UI
    * [ ] Vampire the Masquerade
        * [ ] Data model
        * [ ] UI

### Infrastructure Revamp

I want to rework a lot of the infrastructure so that it's easier to add things to in the future. The basic idea is this:

* [X] ~~Switch to Vuetify (I don't like it's API as much but it's worlds faster, with better components.)~~
* [X] Switch to Bootstrap v4 (and Bootstrap-Vue)
* [X] Add a base model class that knows if it's dirty ~~(Proxy-based)~~
* [X] Use RxJS to manage state; the current character becomes an observable
* [ ] Evaluate using `vuex` instead of RxJS, and the special models.
* [X] Move all resource access (like loading characters, systems, etc) into 'resource-access'
* [X] Move all state holding and application logic to 'managers'
* [X] Make components very, very dumb. They only have their own state, and logic relevant to their display.
* [X] Move to ~~webpack~~ parcel.
* [ ] Implement `socket.io` so open pages stay in sync as changes are made. (Think, GM opening character pages.)
* [X] Move to `knex` and sqlite (with the option for `postgres` for deployment)
* [X] Move away from one table per system character to a single character record.
    * [X] ~~The system specific data would be a `any()` blob of JSON.~~
    * [X] Each system would define an [ajv][] schema for it's specific data.
    * [ ] Evaluate and possibly implement [Joi][joi] instead of [AJV][ajv].
    * [ ] Any additional data (classes, spells, etc) needed should be treated as static data, ~~and loaded from json files on disk.~~ and loaded as seeds into the database.
* [X] Move and refactor systems; they should no longer be their own thing, they should be integrated as just run of the
    mill routes/components, as part of the application. No need for shared units like current.
* [ ] Convert to typescript
* [ ] Setup a reasonable ~~docker build~~/deploy pipeline in GitHub. (PARTIAL)
* [X] Setup eslint MR checking in GitHub.

This should really set us up for more complex interactions and a much faster time to implementing Campaigns.

[ajv]: http://epoberezkin.github.io/ajv/
[joi]: https://github.com/hapijs/joi
