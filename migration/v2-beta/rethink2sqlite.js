//----------------------------------------------------------------------------------------------------------------------
// Conversion of the RethinkDB to SQLite
//----------------------------------------------------------------------------------------------------------------------

const logging = require('trivial-logging');
logging.init({ debug: true, debugStream: true });
const logger = logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

const config = require('../../config');

// Utils
const { shortID } = require('../../server/utilities');

// Database junk
const r = require('rethinkdbdash')(config.rethink);
const dbMan = require('../../server/database');

//----------------------------------------------------------------------------------------------------------------------

async function main()
{
    logger.info('Starting Conversion...');

    const db = await dbMan.getDB();

    //------------------------------------------------------------------------------------------------------------------
    // Importing Accounts
    //------------------------------------------------------------------------------------------------------------------

    logger.info('  Importing accounts...');
    const users = await r.db('rpgkeeper').table('accounts').run();
    const userPromises = users.map(async (user) =>
    {
        const matchingAccounts = await db
            .select()
            .from('account')
            .where({ email: user.email });

        if(matchingAccounts.length > 0)
        {
            return await db('account')
                .update({
                    hash_id: user.id,
                    email: user.email,
                    name: user.email.split('@')[0],
                    avatar: user.avatar,
                    permissions: JSON.stringify(user.permissions),
                    settings: JSON.stringify(user.settings),
                    created: db.raw(`datetime("${ user.created.toISOString() }")`)
                })
                .where({ email: user.email });
        }
        else
        {
            return await db('account')
                .insert({
                    hash_id: user.id,
                    email: user.email,
                    name: user.email.split('@')[0],
                    avatar: user.avatar,
                    permissions: JSON.stringify(user.permissions),
                    settings: JSON.stringify(user.settings),
                    created: db.raw(`datetime("${ user.created.toISOString() }")`)
                });
        } // end if
    });

    // Wait for all users to be imported
    await Promise.all(userPromises);
    logger.info('  ...Accounts imported.');

    //------------------------------------------------------------------------------------------------------------------
    // Importing Base Characters & Notes
    //------------------------------------------------------------------------------------------------------------------

    logger.info('  ...Importing Characters.');
    const baseChars = await r.db('rpgkeeper').table('base_characters').run();
    const baseCharPromises = baseChars.map(async (char) =>
    {
        const matchingChars = await db
            .select()
            .from('character')
            .where({ hash_id: char.id });

        if(matchingChars.length > 0)
        {
            logger.warn(`Skipping existing character ${ char.id }`);
        }
        else
        {
            logger.info(`    Importing character ${ char.id }`);

            // Look up account
            const [ { account_id } ] = await db
                .select()
                .from('account')
                .where({ email: char.owner });

            logger.info('    Importing Notes...');

            // Create a note entry
            const [ noteID ] = await db('note').insert({ hash_id: shortID() });

            // Insert pages
            const pagesPromises = char.notes
                .concat()
                .map(async (page) =>
                {
                    return await db('note_page')
                        .insert({
                            title: page.title,
                            content: page.content,
                            note_id: noteID
                        });
                });

            // Wait for pages to be done
            await Promise.all(pagesPromises);
            logger.info('    ...Notes Imported.');

            // Get System char
            let sysChar = {};
            if(char.system === 'fate')
            {
                sysChar = await r.db('rpgkeeper').table('fate_characters').get(char.id).run();
            }
            else if(char.system === 'risus')
            {
                sysChar = await r.db('rpgkeeper').table('risus_characters').get(char.id).run();
            } // end if

            // Remove the 'id' property from the sysChar
            delete sysChar.id;

            return await db('character')
                .insert({
                    hash_id: char.id,
                    system: char.system,
                    description: char.description,
                    portrait: char.portrait,
                    thumbnail: char.thumbnail,
                    color: char.color,
                    biography: char.biography,
                    note_id: noteID,
                    details: JSON.stringify(sysChar),
                    account_id
                });
        } // end if
    });

    // Wait for all chars to be imported
    await Promise.all(baseCharPromises);
    logger.info('  ...Characters imported.');

    //------------------------------------------------------------------------------------------------------------------

    // Exit the script
    logger.info('Conversion complete!');
    process.exit();
} // end main

//----------------------------------------------------------------------------------------------------------------------

// Run the main script
main();

//----------------------------------------------------------------------------------------------------------------------
