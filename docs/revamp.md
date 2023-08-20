# Infrastructure Revamp

I want to rework a lot of the infrastructure so that it's easier to add things to in the future. The basic idea is this:

* [X] ~~Switch to Vuetify (I don't like it's API as much but it's worlds faster, with better components.)~~
* [X] Switch to Bootstrap v4 (and Bootstrap-Vue)
* [X] Add a base model class that knows if it's dirty ~~(Proxy-based)~~
* [X] Use RxJS to manage state; the current character becomes an observable
* [X] ~~Evaluate using `vuex` instead of RxJS, and the special models.~~
* [X] Move all resource access (like loading characters, systems, etc) into 'resource-access'
* [X] Move all state holding and application logic to 'managers'
* [X] Make components very, very dumb. They only have their own state, and logic relevant to their display.
* [X] Move to ~~webpack~~ parcel.
* [X] Implement `socket.io` so open pages stay in sync as changes are made. (Think, GM opening character pages.)
* [X] Move to `knex` and sqlite (with the option for `postgres` for deployment)
* [X] Move away from one table per system character to a single character record.
    * [X] ~~The system specific data would be a `any()` blob of JSON.~~
    * [X] Each system would define an [ajv][] schema for it's specific data.
    * [X] ~~Evaluate and possibly implement [Joi][joi] instead of [AJV][ajv].~~
    * [X] Any additional data (classes, spells, etc) needed should be treated as static data, and loaded as seeds into the database.
* [X] Move and refactor systems; they should no longer be their own thing, they should be integrated as just run-of-the-mill routes/components, as part of the application. No need for shared units like current.
* [X] Convert to typescript
    * [ ] Convert to better validation/data model (See #52)
* [ ] Setup a reasonable ~~docker build~~/deploy pipeline in GitHub. (PARTIAL)
* [X] Setup eslint MR checking in GitHub.

This should really set us up for more complex interactions and a much faster time to implementing Campaigns.

[ajv]: http://epoberezkin.github.io/ajv/
[joi]: https://github.com/hapijs/joi

_Note: This should move into issues, but for now it was easier to think about in a markdown file._
