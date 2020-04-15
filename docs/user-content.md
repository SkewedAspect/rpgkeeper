# User Generated Content

The following is the basic design and intentions behind handling user content in RPGKeeper. This site is not possible
without user generated content, and designing/maintaining a good, workable system for getting content added is a
necessity.

## What is 'UGC'?

In the context of this document, 'user generated content' (UGC) is actually portions of a character that are generally  
long-form, rules-related, and required to play a character (i.e. powers, feats, abilities, etc.). These are the types of
things that users want to be provided, but most sites can't without a licensing agreement, as it involves reproducing
parts of the source books.

### Homebrew

In addition to content reproduced from books, there's Homebrew content that needs to be supported as well. This content
needs to be clearly delineated as Homebrew to a user, but otherwise should got through the same process as all other
UGC.

## The Problem

RPGKeeper operates in a rather difficult to navigate grey area. It's intended to be a _companion_ for players, not a
_replacement_ for source books. If we were being a replacement, we'd need to license the systems and, to be honest,
that's tricky at best, impossible at worst. Instead, we have to try to be useful to users, without letting them play
with nothing but RPGKeeper. The problem is, RPGKeeper's interests (keep the user in the app and engaged as much as
possible) and the various system's copyright holder's interests (drive licensed sales of the books) are diametrically
opposed. Every feature we add to make the player's lives easier has to be weighed against crossing the line into law
suit territory from the copyright holders.

In order to help draw this line, we've created RPGKeeper's UGC Policy to try and strike a balance. It's not just a
policy for development, it's actually baked into the architecture of the application and the way users interact with it
as a result. By embedding it at this deep a level we hope to show not just a 'good faith' attitude, but get as close to
having our cake and eating it, too.

## UGC Policy

> All content not marked 'official' (i.e. committed in the source code of RPGKeeper) is considered UGC, and is input
> directly by users. Users are allowed to enter whatever UGC they wish (even content that doesn't meet our public
> guidelines), and it will be available to them, exclusively. No sharing of UGC is allowed without going through a
> moderation process that enforces our Public UGC policy. This moderation process, while machine-assisted, will always
> end with a human being make the decision to allow the UGC to be publicly available.
> 
> Public UGC will be controlled (edited, added, or removed) by RPGKeeper moderators, and is made available at the sole
> discretion of RPGKeeper. Users will have the ability to request changed to public UGC, however, they will not be able
> to edit them.

RPGKeeper, while not a wiki, operates much like one, except every "page" is unique to the users, and moderators are
required to make them publicly visible. In actual fact, it's worse than just being a handful of pages, it's every power,
feat, ability, talent, etc. across every supported system.

While we feel this approach gives the users as much control as possible (they can input enough to never have to crack
open a book, if they wish) they can't _distribute_ that work to other users. Each user has to repeat that work (and
therefore, have access to the source books).

_Note: It's technologically impossible to prevent sufficiently skilled users from dumping their UGC. Even worse, it's
impossible to fully prevent sufficiently skilled users from taking one of those dumps and 'replaying' it through the
website. All we can do is use tools like rate-limiting and response delays to make it frustrating to attempt to do so.
**Players attempting to do this will violate the Terms of Use, and will have their accounts (and email) banned.**_

Users do need the ability to suggest edits to public UGC, as typos or mistakes may happen. The current intention is to
handle this via the public GitHub, with an issue template that can be opened via a link in the RPGKeeper application.

### Guidelines for Public UGC

> All Public UGC must adhere to the following:
>
> * Must provide an accurate Reference. (i.e. book and page, or be marked 'Homebrew')
> * Any works marked 'Homebrew' must be licensed under either:
>     * Creative Commons Attribution-ShareAlike International (CC BY-SA)
>     * Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
>         * This license is allowed as long as express permission for RPGKeeper to distribute the work is given.
> * If not marked 'Homebrew', the UGC must be a summary of the _rules_ portion of the reproduced content. 
>     * Flavor, unless relevant to the rules, are prohibited.
>     * Full text reproductions, unless 'trivial' (i.e. simple rules statements) are prohibited.
> * UGC must be considered 'safe':
>     * Does not contain personal information about real people
>     * Does not contain content that may be harmful, or indicate harm to a real person
>     * Does not contain blatantly pornographic materials
>     * Does not contain content considered illegal in the United States of America.

Public UGC should be a) copyright friendly (i.e. reproducing only a summary of the relevant rules) and b) "safe" (i.e.
not contain personal information, threats of harm, or blatantly pornographic content).

That being said, RPGKeeper is **not** going to moderate content for socially taboo topics. For example, in countries
where LGBTQ+ topics are considered taboo, we will not be filtering UGC that references those topics. The "bare bones"
moderation we're doing is to prevent UGC that presents a reasonable concern for harm to one (or more) users.

The "blatant sexual content" exception is a compromise for our otherwise hands-off approach. While not universally
considered objectionable, it is the type of content that we feel a large percentage of our user base would not be
expecting when looking through public UGC, and therefore, do not want to complicate matters by having to implement some
sort of 'sexual content' filtering mechanism when searching. Since such content is allowed privately, or in a campaign,
we feel this is a reasonable stance.

Based on community feedback, however, we are open to considering the work to implement such a content filtering system,
and removing this restriction.

Regarding illegal content, as RPGKeeper is not an international company, we consider ourselves to be operating within
the bounds of US law, and moderate our content as such.

### Campaign UGC

> UGC created for a campaign is considered private, despite being shared among a limited group of users. Campaigns have
> an upper limit on the number of players allowed, and characters created in the campaign cannot be transferred to
> another campaign, or copied. Campaign UGC is not allowed in characters not associated with the originating campaign.

When a user creates a campaign, they have the ability to create UGC that _is_ shared amongst everyone in a campaign.
However, to prevent usage of campaigns as a way to circumvent moderation, we only allow UGC in characters added to the
originating campaign, and we don't allow the characters to be moved or copied. There is a limit on the number of players
in a campaign, which means the effort required for wide-scale piracy would be very difficult.

Additionally, only the GM has the ability to add UGC to a campaign, meaning a concerted effort by a group of people to  
create infringing UGC should not be possible.

## Promoting Private UGC to Public

> UGC can be submitted for promotion to public content via the originating user. Once determined to meet the UGC Public
> Guidelines, the UGC will be flagged as public, and the user's ability to modify it will be removed.

Any UGC can be submitted for approval. As long as it meets the guidelines above, it will be accepted. Once accepted, we
remove the ability for the user to edit it. Once it's become public UGC, it must be edited via a moderator, just like
all other public UGC, or 'official' content. This limitation is intended to prevent editing UGC to violate the Public
Guidelines after moderator approval.

---

## Technical Details

What follows is a technical discussion on the design and implementation of the above policies. This content is intended
for contributors to the project. Feel free to follow along, but it is not written for the laymen.

### Finish this.

...later.
