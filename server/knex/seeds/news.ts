//----------------------------------------------------------------------------------------------------------------------
// Default News Articles
//----------------------------------------------------------------------------------------------------------------------

import logging from 'trivial-logging';
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

exports.seed = async(knex) =>
{
    try
    {
        await knex('post')
            .insert({
                account_id: 1,
                title: 'New RPGKeeper, Same Goals',
                stinger: "Today marks the start of a new code base for RPGKeeper. This has been a while in coming, and to be honest, I'm ecstatic.\n"
                    + "The previous versions have all had their share of flaws and as I've grown as a developer, my understanding of the right\n"
                    + 'tools for the right job has grown exponentially. As such, I made the executive decision to start the code-base over from\n'
                    + 'scratch, new repo, new ideas.',
                content: "Today marks the start of a new code base for RPGKeeper. This has been a while in coming, and to be honest, I'm ecstatic.\n"
                    + "The previous versions have all had their share of flaws and as I've grown as a developer, my understanding of the right\n"
                    + 'tools for the right job has grown exponentially. As such, I made the executive decision to start the code-base over from\n'
                    + 'scratch, new repo, new ideas.\n'
                    + '## New Features\n'
                    + '\n'
                    + "One of the things I'm the most excited about is the new modular design. Now, anyone can write systems for RPGKeeper, and\n"
                    + "it's trivial to install and extend the core application. I've worked hard to make building these systems easy for\n"
                    + 'others. Since RPGKeeper can be installed and run by anyone, not just on the main website, I wanted to make sure that\n'
                    + "anyone can create systems that they want to use for their gaming groups. If the systems are good enough, then they'll\n"
                    + 'get included on the main site.\n'
                    + '\n'
                    + "In addition to this, I've made a very simple REST API for sharing the basic information about characters. This could be\n"
                    + "used by forums or battle map sites for character avatars. I'm excited to see where this goes.\n"
                    + '\n'
                    + "The final new feature that I'm really excited about is the Generic System. It's designed to be usable with any RPG. I've\n"
                    + 'noticed in my gaming group, a lot of people like the flexibility of just using notepad. However, figuring out your rolls\n'
                    + "is really difficult. So, I've created a generic system that lets you define your rolls, and enter any text you want,\n"
                    + "however you want. As it gets closer to being ready, I'll go more in depth about it.\n"
                    + '\n'
                    + '## Stay tuned\n'
                    + '\n'
                    + "The ball is rolling, and I've got some really good momentum. This is going to be epic!",
                created: knex.raw('datetime("2015-02-01T18:00:00")'),
                edited: knex.raw('datetime("2015-02-01T18:00:00")')
            });

        await knex('post')
            .insert({
                account_id: 1,
                title: 'New Accounts, DB, Generic System',
                stinger: 'First, I should apologize for such a long release cycle. A year is a log longer than I would have liked, but there have\n'
                    + "been massive changes under the hood to RPGKeeper. We've changed to [VueJS], switched our database to [TrivialDB], and\n"
                    + "moved our login system to local accounts, as opposed to Persona. These are a lot of changes, but they've put us on a\n"
                    + 'good path for the future.\n'
                    + '\n'
                    + 'There will be more updates at a much more regular interval from here on out.\n'
                    + '\n'
                    + '[VueJS]: http://vuejs.org/\n'
                    + '[TrivialDB]: https://github.com/Morgul/trivialdb',
                content: 'First, I should apologize for such a long release cycle. A year is a log longer than I would have liked, but there have\n'
                    + "been massive changes under the hood to RPGKeeper. We've changed to [VueJS], switched our database to [TrivialDB], and\n"
                    + "moved our login system to local accounts, as opposed to Persona. These are a lot of changes, but they've put us on a\n"
                    + 'good path for the future.\n'
                    + '\n'
                    + 'There will be more updates at a much more regular interval from here on out.\n'
                    + '\n'
                    + '[VueJS]: http://vuejs.org/\n'
                    + '[TrivialDB]: https://github.com/Morgul/trivialdb\n'
                    + '\n'
                    + '## New Features\n'
                    + '\n'
                    + 'There have been a lot of minor changes to the site, but these are the headline features:\n'
                    + '\n'
                    + '### Local Accounts\n'
                    + '\n'
                    + '**RPGKeeper now requires you to register a local account.** This is because of the [Persona shutdown] in November. Your\n'
                    + 'account has been transitioned, however, it has no password. You will need to follow the "Forgot Password" procedure to \n'
                    + 'gain access to your account.\n'
                    + '\n'
                    + '### Improved Database\n'
                    + '\n'
                    + "We've transitioned to [TrivialDB], which is a lightweight JSON database, written by me. Not only has this removed a huge\n"
                    + "dependency that slowed down development significantly, but it's also improved page load times. Everything should be\n"
                    + 'faster, snappier, and more reliable.\n'
                    + '\n'
                    + '### Improved Generic System\n'
                    + '\n'
                    + 'The Generic system has been greatly improved, and is now capable of supporting a D&D 3.5 or 4e character quite easily.\n'
                    + "There's still a lot of work to do, but it's gotten significantly more powerful. After a bit more iteration on it, I feel\n"
                    + 'it should be ready for general use by the public. If you want to help out now, feel free to start using it, and giving\n'
                    + 'us [feedback]!\n'
                    + '\n'
                    + '### Improvements to the News Page\n'
                    + '\n'
                    + "We've changed how we do this very page, making it much easier to write and update. The code's much faster, too. Nothing\n"
                    + 'huge, but every little bit helps.\n'
                    + '\n'
                    + '## Comming Soon\n'
                    + '\n'
                    + "The next big update will be the addition of the Dungeons and Dragon's 4th edition system, as well as the Edge of the\n"
                    + "Empire system. These are very high on my todo list and I'm really motivated to get them done.\n"
                    + '\n'
                    + "While that's going on, I will probably add in a permissions system, and start working on features to make RPGKeeper more\n"
                    + 'focused on community contributions to systems (like powers and feats for `dnd4e`, or force powers for `eote`). The whole\n'
                    + 'idea is to allow the community to put in everything players need to reference, like an interactive wiki.\n'
                    + '\n'
                    + '[Persona shutdown]: https://wiki.mozilla.org/Identity/Persona_Shutdown_Guidelines_for_Reliers\n'
                    + '[feedback]: https://github.com/Morgul/rpgkeeper/issues "RPGKeeper Issues"',
                created: knex.raw('datetime("2016-05-04T18:00:00")'),
                edited: knex.raw('datetime("2016-05-04T18:00:00")')
            });

        await knex('post')
            .insert({
                account_id: 1,
                title: 'Major Update',
                stinger: "The project has sat by the wayside for the past 8 months or so, while I've focused on other endeavours. My gaming groups\n"
                    + "dried up, for the most part, and only recently have started to pick back up. So, it's only just recently that I've\n"
                    + "started working on RPGKeeper again. But, I haven't been idle this whole time; I've been learning new skills and\n"
                    + "technologies that should make \"RPGKeeper great again.\" (_I couldn't resist._)",
                content: "The project has sat by the wayside for the past 8 months or so, while I've focused on other endeavours. My gaming groups\n"
                    + "dried up, for the most part, and only recently have started to pick back up. So, it's only just recently that I've\n"
                    + "started working on RPGKeeper again. But, I haven't been idle this whole time; I've been learning new skills and\n"
                    + "technologies that should make \"RPGKeeper great again.\" (_I couldn't resist._)\n"
                    + '\n'
                    + '## Technical Details\n'
                    + '\n'
                    + "For the tech-savy among you, I've upgraded to [VueJS 2.X], and [Material Design] thanks to the [vue-material] project. I\n"
                    + "also went back to Google based logins; it's so much less of a headache for me than having to have local based logins.\n"
                    + "Even for the users, it's more convenient, since Google remembers your login and auto-signs you in. So, all around, this\n"
                    + "is the best way to move forward, IMHO. I may expand and also offer Facebook and Twitter logins, but that's down the road.\n"
                    + '\n'
                    + '[VueJS 2.X]: http://vuejs.org/\n'
                    + '[Material Design]: https://material.io/\n'
                    + '[vue-material]: https://vuematerial.github.io\n'
                    + '\n'
                    + '### Going back to RethinkDB\n'
                    + '\n'
                    + 'The original v2.0.0 beta was built on [RethinkDB]. I loved it as a database, unfortunately, it was difficult to work to\n'
                    + "get setup developing against. Fast forward two years, and now [Docker] has made that sort of thing easy. It's trivially\n"
                    + "available for all platforms, no running in a VM, and everything just works right out of the box. Because of that, I've\n"
                    + "decided to go back to my favorite database, and not continue on the codebase I've written. There's less chance for failure,\n"
                    + "and less reason to think there's a critical bug that will make us lose your data.\n"
                    + '\n'
                    + '[RethinkDB]: https://www.rethinkdb.com/\n'
                    + '[Docker]: https://www.docker.com/\n'
                    + '\n'
                    + "#### Isn't RethinkDB dead?\n"
                    + '\n'
                    + "To paraphrase Mark Twain: 'the rumors of RethinkDB's death have been greatly exaggerated.' Yes, the startup that built\n"
                    + 'Rethink has filed for bankruptcy. That is, in fact, a sad blow to the RethinkDB community. But, RethinkDB is still being\n'
                    + "developed, and they're currently looking for an open-source foundation to keep everything going. I'm both showing my\n"
                    + 'support by continuing to use it, and watching to see which way the wind blows. If it dies, chances are I can stay on the\n'
                    + "latest version for quite a lone time before making a switch. I'll evaluate options when it comes to that; it's all JSON\n"
                    + "anyway, so migration shouldn't be hard.\n"
                    + '\n'
                    + '## Moving Forward\n'
                    + '\n'
                    + "Moving forward, I'm going to complete the base rewrite. Then, I'm going to port over the old 'Edge of the Empire' system,\n"
                    + 'so that I can finally replace the aging version out on [rpgkeeper.com](http://rpgkeeper.com). Once that is done, I will\n'
                    + "be working on adding in the [FATE] system (currently playing a game in it) and the [Risus] system (very simple). I'll then\n"
                    + "add campaign support, and start working on adding in D&D 5e. That's the rough timeline.\n"
                    + '\n'
                    + '[FATE]: https://fate-srd.com/\n'
                    + '[Risus]: http://www222.pair.com/sjohn/risus.htm',
                created: knex.raw('datetime("2017-01-23T18:00:00")'),
                edited: knex.raw('datetime("2017-01-23T18:00:00")')
            });
    }
    catch (error)
    {
        logger.warn('Error running seed:', error);
    } // end try/catch
};

//----------------------------------------------------------------------------------------------------------------------
