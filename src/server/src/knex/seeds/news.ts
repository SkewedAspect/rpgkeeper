//----------------------------------------------------------------------------------------------------------------------
// Historical News Posts
//----------------------------------------------------------------------------------------------------------------------
// Restores the original 3 news posts from the project's history.
//----------------------------------------------------------------------------------------------------------------------

import type { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

const posts = [
    {
        post_id: 'post-2015-02-01',
        account_id: null, // Will be set to first admin account
        slug: 'new-rpgkeeper-same-goals',
        title: 'New RPGKeeper, Same Goals',
        stinger: `Today marks the start of a new code base for RPGKeeper. This has been a while in coming, and to be honest, I'm ecstatic.
The previous versions have all had their share of flaws and as I've grown as a developer, my understanding of the right
tools for the right job has grown exponentially. As such, I made the executive decision to start the code-base over from
scratch, new repo, new ideas.`,
        content: `Today marks the start of a new code base for RPGKeeper. This has been a while in coming, and to be honest, I'm ecstatic.
The previous versions have all had their share of flaws and as I've grown as a developer, my understanding of the right
tools for the right job has grown exponentially. As such, I made the executive decision to start the code-base over from
scratch, new repo, new ideas.

## New Features

One of the things I'm the most excited about is the new modular design. Now, anyone can write systems for RPGKeeper, and
it's trivial to install and extend the core application. I've worked hard to make building these systems easy for
others. Since RPGKeeper can be installed and run by anyone, not just on the main website, I wanted to make sure that
anyone can create systems that they want to use for their gaming groups. If the systems are good enough, then they'll
get included on the main site.

In addition to this, I've made a very simple REST API for sharing the basic information about characters. This could be
used by forums or battle map sites for character avatars. I'm excited to see where this goes.

The final new feature that I'm really excited about is the Generic System. It's designed to be usable with any RPG. I've
noticed in my gaming group, a lot of people like the flexibility of just using notepad. However, figuring out your rolls
is really difficult. So, I've created a generic system that lets you define your rolls, and enter any text you want,
however you want. As it gets closer to being ready, I'll go more in depth about it.

## Stay tuned

The ball is rolling, and I've got some really good momentum. This is going to be epic!`,
        status: 'published',
        created: '2015-02-01T18:00:00.000Z',
        edited: '2015-02-01T18:00:00.000Z',
        published_at: '2015-02-01T18:00:00.000Z',
    },
    {
        post_id: 'post-2016-05-04',
        account_id: null,
        slug: 'new-accounts-db-generic-system',
        title: 'New Accounts, DB, Generic System',
        stinger: `First, I should apologize for such a long release cycle. A year is a log longer than I would have liked, but there have
been massive changes under the hood to RPGKeeper. We've changed to [VueJS], switched our database to [TrivialDB], and
moved our login system to local accounts, as opposed to Persona. These are a lot of changes, but they've put us on a
good path for the future.

There will be more updates at a much more regular interval from here on out.

[VueJS]: http://vuejs.org/
[TrivialDB]: https://github.com/Morgul/trivialdb`,
        content: `First, I should apologize for such a long release cycle. A year is a log longer than I would have liked, but there have
been massive changes under the hood to RPGKeeper. We've changed to [VueJS], switched our database to [TrivialDB], and
moved our login system to local accounts, as opposed to Persona. These are a lot of changes, but they've put us on a
good path for the future.

There will be more updates at a much more regular interval from here on out.

[VueJS]: http://vuejs.org/
[TrivialDB]: https://github.com/Morgul/trivialdb

## New Features

There have been a lot of minor changes to the site, but these are the headline features:

### Local Accounts

**RPGKeeper now requires you to register a local account.** This is because of the [Persona shutdown] in November. Your
account has been transitioned, however, it has no password. You will need to follow the "Forgot Password" procedure to
gain access to your account.

### Improved Database

We've transitioned to [TrivialDB], which is a lightweight JSON database, written by me. Not only has this removed a huge
dependency that slowed down development significantly, but it's also improved page load times. Everything should be
faster, snappier, and more reliable.

### Improved Generic System

The Generic system has been greatly improved, and is now capable of supporting a D&D 3.5 or 4e character quite easily.
There's still a lot of work to do, but it's gotten significantly more powerful. After a bit more iteration on it, I feel
it should be ready for general use by the public. If you want to help out now, feel free to start using it, and giving
us [feedback]!

### Improvements to the News Page

We've changed how we do this very page, making it much easier to write and update. The code's much faster, too. Nothing
huge, but every little bit helps.

## Coming Soon

The next big update will be the addition of the Dungeons and Dragon's 4th edition system, as well as the Edge of the
Empire system. These are very high on my todo list and I'm really motivated to get them done.

While that's going on, I will probably add in a permissions system, and start working on features to make RPGKeeper more
focused on community contributions to systems (like powers and feats for \`dnd4e\`, or force powers for \`eote\`). The whole
idea is to allow the community to put in everything players need to reference, like an interactive wiki.

[Persona shutdown]: https://wiki.mozilla.org/Identity/Persona_Shutdown_Guidelines_for_Reliers
[feedback]: https://github.com/Morgul/rpgkeeper/issues "RPGKeeper Issues"`,
        status: 'published',
        created: '2016-05-04T18:00:00.000Z',
        edited: '2016-05-04T18:00:00.000Z',
        published_at: '2016-05-04T18:00:00.000Z',
    },
    {
        post_id: 'post-2017-01-23',
        account_id: null,
        slug: 'major-update',
        title: 'Major Update',
        stinger: `The project has sat by the wayside for the past 8 months or so, while I've focused on other endeavours. My gaming groups
dried up, for the most part, and only recently have started to pick back up. So, it's only just recently that I've
started working on RPGKeeper again. But, I haven't been idle this whole time; I've been learning new skills and
technologies that should make "RPGKeeper great again." (_I couldn't resist._)`,
        content: `The project has sat by the wayside for the past 8 months or so, while I've focused on other endeavours. My gaming groups
dried up, for the most part, and only recently have started to pick back up. So, it's only just recently that I've
started working on RPGKeeper again. But, I haven't been idle this whole time; I've been learning new skills and
technologies that should make "RPGKeeper great again." (_I couldn't resist._)

## Technical Details

For the tech-savy among you, I've upgraded to [VueJS 2.X], and [Material Design] thanks to the [vue-material] project. I
also went back to Google based logins; it's so much less of a headache for me than having to have local based logins.
Even for the users, it's more convenient, since Google remembers your login and auto-signs you in. So, all around, this
is the best way to move forward, IMHO. I may expand and also offer Facebook and Twitter logins, but that's down the road.

[VueJS 2.X]: http://vuejs.org/
[Material Design]: https://material.io/
[vue-material]: https://vuematerial.github.io

### Going back to RethinkDB

The original v2.0.0 beta was built on [RethinkDB]. I loved it as a database, unfortunately, it was difficult to work to
get setup developing against. Fast forward two years, and now [Docker] has made that sort of thing easy. It's trivially
available for all platforms, no running in a VM, and everything just works right out of the box. Because of that, I've
decided to go back to my favorite database, and not continue on the codebase I've written. There's less chance for failure,
and less reason to think there's a critical bug that will make us lose your data.

[RethinkDB]: https://www.rethinkdb.com/
[Docker]: https://www.docker.com/

#### Isn't RethinkDB dead?

To paraphrase Mark Twain: 'the rumors of RethinkDB's death have been greatly exaggerated.' Yes, the startup that built
Rethink has filed for bankruptcy. That is, in fact, a sad blow to the RethinkDB community. But, RethinkDB is still being
developed, and they're currently looking for an open-source foundation to keep everything going. I'm both showing my
support by continuing to use it, and watching to see which way the wind blows. If it dies, chances are I can stay on the
latest version for quite a lone time before making a switch. I'll evaluate options when it comes to that; it's all JSON
anyway, so migration shouldn't be hard.

## Moving Forward

Moving forward, I'm going to complete the base rewrite. Then, I'm going to port over the old 'Edge of the Empire' system,
so that I can finally replace the aging version out on [rpgkeeper.com](http://rpgkeeper.com). Once that is done, I will
be working on adding in the [FATE] system (currently playing a game in it) and the [Risus] system (very simple). I'll then
add campaign support, and start working on adding in D&D 5e. That's the rough timeline.

[FATE]: https://fate-srd.com/
[Risus]: http://www222.pair.com/sjohn/risus.htm`,
        status: 'published',
        created: '2017-01-23T18:00:00.000Z',
        edited: '2017-01-23T18:00:00.000Z',
        published_at: '2017-01-23T18:00:00.000Z',
    },
];

//----------------------------------------------------------------------------------------------------------------------

export async function seed(knex : Knex) : Promise<void>
{
    // Find the first admin account to use as the author
    const adminRole = await knex('account_role')
        .select('account_id')
        .where('role_id', 1)
        .first();

    const accountId = adminRole?.account_id ?? null;

    // Insert posts with the admin account as author
    for(const post of posts)
    {
        // Check if post already exists
        // eslint-disable-next-line no-await-in-loop
        const existing = await knex('post')
            .where('post_id', post.post_id)
            .first();

        if(!existing)
        {
            // eslint-disable-next-line no-await-in-loop
            await knex('post').insert({
                ...post,
                account_id: accountId,
            });
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
