# Infrastructure Revamp MkII

Back at it again.

* [X] Switch to Bootstrap v5 (and Bootstrap-Vue-Next)
* [X] Switch to Vue 3
* [ ] Change FontAwesome imports to [tree-shakable][] version
* ~~[ ] Switch to New [Color-picker][]~~ Old one works fine
* [ ] Convert from decoders to better validation/data model
  * [ ] Evaluate options in 2024 ([ajv][], [ajv-ts][] [joi][], [zod][], etc)
* [ ] Add local user registration, link with Google / Facebook / Twitter
* [ ] Remove/replace the 'supplements' system with a more customized system per system.
* [ ] Move project to GitLab (and make GitHub a mirror)
  * [ ] Set Pipelines for CI/CD
    * [ ] Dev deploys on all master merges
    * [ ] Beta deploys on all beta tags
    * [ ] Prod deploys on all release tags

## New Features
* [ ] Improved Dashboard
* [ ] Campaigns
* [ ] Maps
* [ ] Mooks

<!-- Links -->

[ajv]: http://epoberezkin.github.io/ajv/
[ajv-ts]: https://github.com/vitalics/ajv-ts
[joi]: https://github.com/hapijs/joi
[zod]: https://github.com/colinhacks/zod

[color-picker]: https://github.com/cyhnkckali/vue3-color-picker
[tree-shakable]: https://docs.fontawesome.com/apis/javascript/tree-shaking
